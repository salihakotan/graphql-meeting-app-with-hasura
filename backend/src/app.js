const express = require("express")

const app = express()
app.use(express.json())

app.post("/register", (req,res)=> {
    const input = req.body.input.data
    console.log(input)
    res.json({
        accessToken:"accessTokenx"
    })
})


app.listen(4000, ()=> console.log("server is up and running on port 4000"))