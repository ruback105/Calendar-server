const mongoose = require('mongoose')

const ReminderSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now
  },
  trigger: {
      type: Number,
      default: 0
  },
})

module.exports = mongoose.model('Reminders', ReminderSchema)