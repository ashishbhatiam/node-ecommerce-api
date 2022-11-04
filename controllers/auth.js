const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const { createJWTtoken } = require('../utils/index')

const register = async (req, res) => {
  const { name, password, email } = req.body
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError(
      'Email already exists, Please try a different email.'
    )
  }
  const user = await User.create({ name, password, email })
  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role
  }
  const token = createJWTtoken(tokenUser)
  res.status(StatusCodes.CREATED).json({ user, token })
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
