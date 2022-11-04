const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')

const register = async (req, res) => {
  const { name, password, email } = req.body
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError(
      'Email already exists, Please try a different email.'
    )
  }
  const user = await User.create({ name, password, email })
  res.status(StatusCodes.CREATED).json(user)
}

const login = async (req, res) => {
  res.send('Login User!')
}

const logout = async (req, res) => {
  res.send('Logout User!')
}

module.exports = {
  register,
  login,
  logout
}
