const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 5
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
})

module.exports = mongoose.model('User', UserSchema)
