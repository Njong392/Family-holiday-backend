require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const accommodationRoutes = require('./routes/accommodations')
const savedAccommodationRoutes = require('./routes/savedAccommodations')
const chatRoutes = require('./routes/chat')

//initialize app
const app = express();

//middleware
app.use(cors())

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/user', userRoutes)
app.use('/api/accommodation', accommodationRoutes)
app.use('/api/savedAccommodation', savedAccommodationRoutes)
app.use('/api/chat', chatRoutes)

//connect to the db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to the db and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })