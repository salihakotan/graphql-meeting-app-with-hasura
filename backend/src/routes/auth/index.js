import Boom from "boom"
import express from "express"

const router = express.Router()


router.post("/register", (req,res,next)=>{
    const input = req.body.input.data

    if(!input.email || !input.password) {
        return next(Boom.badRequest("Email and password are required"))
    }

    res.json({
        accessToken:"accestokenx"
    })
})

export default router