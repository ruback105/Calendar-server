const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: {
    type: String,
    required: true,
  },
  phone: String,
  PasswordHash: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Users', UserSchema)