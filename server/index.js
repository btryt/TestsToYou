require('dotenv').config()
const express   = require("express")
const app       = express()
const session   = require("express-session")
const authRoute = require("./api/auth")
const testRoute = require("./api/testRoute")
const upload = require("./api/upload")
app.use(express.json())
app.use("/image",express.static("./uploads"))
app.use(session({
    secret:"A-8gt/@5p",
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:60*60*1000
    }
}))
app.use("/api",authRoute)
app.use("/api/test",testRoute)
app.use("/api",upload)
app.listen(4000)