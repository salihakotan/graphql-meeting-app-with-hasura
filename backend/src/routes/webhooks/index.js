import Boom from "boom"
import express from "express"
import Hasura from "../../clients/hasura"
import moment from "moment"
import { GET_MEETING_PARTICIPANTS, GET_MEETING_PARTICIPANTS_REMINDER_QUERY } from "./queries"
import axios from "axios"

import dotenv from "dotenv"

dotenv.config()

import nodemailer from "nodemailer"

const router = express.Router()


const smtpConfig = {
    host:"smtp.gmail.com",
    port:465,
    secure: true, 
    auth: {
        user:'ff2dbce27e274f3b9295@mailspons.com',
        pass:'3bba744199c640aea53c14ef45975691'
    },


}

const transporter = nodemailer.createTransport(smtpConfig)


router.post("/meeting_created", async(req,res,next)=> {

    const meeting = req.body.event.data.new

    const {meetings_by_pk} = await Hasura.request(GET_MEETING_PARTICIPANTS,{
       id:meeting.id
    })
    
    const title = meeting.title

    const {email, fullName} = meetings_by_pk.user
    const participants = meetings_by_pk.participants.map(({user})=> (user.email)).toString()

    const schedule_event = {
        type:"create_scheduled_event",
        args:{
            webhook: '{{ACTION_BASE_ENDPOINT}}/webhooks/meeting_reminder',
            schedule_at: moment(meetings_by_pk.meeting_date).subtract(2,"minutes"),
            payload:{
                meeting_id:meeting.id
            }
        }
    }

    const add_event = await axios('http://localhost:8080/v1/query', {
        method:"POST",
        data: JSON.stringify(schedule_event),
        headers:{
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
        }
    })

    const event_data = add_event.data

    console.log(event_data)

    const mailOptions = {
        from: "ff2dbce27e274f3b9295@mailspons.com",
        to:participants,
        subject: `${fullName} invited you an meeting`,
        text: `${fullName} invited you ${title} meeting`
    }

    transporter.sendMail(mailOptions, (error,info)=> {
        if(error) {
            return next(error)
        }

        return res.json({info})
    })

})

router.post('/meeting_reminder', async(req,res,next) => {

    const {meeting_id} = req.body.payload
    console.log("meeting reminder: meeting_id:",meeting_id)


    const {meetings_by_pk} = await Hasura.request(GET_MEETING_PARTICIPANTS_REMINDER_QUERY,{
        id:meeting_id
     })
     
     const title = meetings_by_pk.title
 
     const {email, fullName} = meetings_by_pk.user
     const participants = meetings_by_pk.participants.map(({user})=> (user.email)).push(email).toString()

     const mailOptions = {
        from: "ff2dbce27e274f3b9295@mailspons.com",
        to:participants,
        subject: `The meeting titled ${title} will start soon`,
        text: `The meeting titled ${title} will start in 2 minutes`
    }

    transporter.sendMail(mailOptions, (error,info)=> {
        if(error) {
            return next(error)
        }

        return res.json({info})
    })

})


export default router