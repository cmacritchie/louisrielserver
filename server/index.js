const express = require('express')
const http = require('http')
const socketIo = require("socket.io")
const cookieSession = require('cookie-session')
const passport = require('passport')
const rootSocket  =require('./websocket/socket')
const path = require('path');

//routes
const authRoute = require('./routes/authRoute')
const houseRoute = require('./routes/houseRoute')
const adminRoute = require('./routes/adminRoute')

require('./db/mongoose')
require('./services/passport')

const app = express()

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys:[process.env.COOKIE_KEY]
    })
)

app.use(passport.initialize())
app.use(passport.session())



app.use(express.json())
app.use(authRoute)
app.use(houseRoute)
app.use(adminRoute)

//added
app.use(express.static(path.join(__dirname, 'client/build')))

const port = process.env.PORT || 5000

//websocket setup

const server = http.createServer(app);
const io = socketIo(server)
rootSocket(io)
// io.on("connection", socket => {
//     console.log("New Client connected")

//     socket.on('incomingData', (data)=> {
//         console.log('received incoming data', data)
//         socket.broadcast.emit("outgoing data", { num: data })
//     });

//     socket.on("disconnect", () => console.log("Client disconnected"))
// })


server.listen(port, () => {
    console.log('Server with websocket is up on port ' + port)
})

// app.listen(port, () => {
//     console.log('Server is up on port ' + port)
// })