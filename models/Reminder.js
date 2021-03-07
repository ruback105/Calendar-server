const mongoose = require('mongoose')

/** TODO - would be better to implement separate day/month/year elements
 * to reduce selected reminders from db by selected current month reminders
 */
const ReminderSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  trigger: {
    type: Number,
    default: false,
  },
  userEmail: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Reminders', ReminderSchema)
