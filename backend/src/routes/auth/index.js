import Boom from "boom"
import express from "express"
import Hasura from "../../clients/hasura"
import { INSERT_USER_MUTATION, IS_EXIST_USER } from "./queries"
import bcrypt from "bcryptjs"
import { registerSchema } from "./validations"
import { signAccessToken } from "./helpers"

const router = express.Router()


router.post("/register", async(req,res,next)=>{
    const input = req.body.input.data

    input.email = input.email.toLowerCase()

    const {error} = registerSchema.validate(input)

    if(error){
        return next(Boom.badRequest(error.details[0].message))
    }


    try {
        
        const isExistUser = await Hasura.request(IS_EXIST_USER, {
            email:input.email
        })

        if(isExistUser.users.length > 0) {
            throw Boom.conflict("User already exist!")
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(input.password,salt)

        const {insert_users_one:user} = await Hasura.request(INSERT_USER_MUTATION, {
            input:{
                ...input,
                password:hash
            }
        })

        const accessToken = await signAccessToken(user)


        res.json({
            accessToken
        })

    } catch (err) {
        return next(Boom.badRequest(err))
    }


   
})

export default router