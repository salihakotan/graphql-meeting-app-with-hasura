import Boom from "boom"
import express from "express"
import Hasura from "../../clients/hasura"
import { GET_MEETING_PARTICIPANTS } from "./queries"

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


export default router