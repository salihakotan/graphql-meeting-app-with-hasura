const express = require("express")

const app = express()

app.get("/", (req,res)=> {
    res.end("Hello world")
})

app.listen(4000, ()=> console.log("server is up and running on port 4000"))