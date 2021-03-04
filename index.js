const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

//Middlewares
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

app.use(bodyParser.json())

//Import routes
const userRoute = require('./routes/user')
const reminderRoute = require('./routes/reminder')

// ROUTES
app.use('/user', userRoute)
app.use('/reminder', reminderRoute)

//Connect to DB
const port = process.env.port | 4000

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`connected on port ${port}`)
  },
)

app.listen(port)
