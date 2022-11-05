const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError
} = require('../errors')
const { attachCookiesToResponse } = require('../utils/index')

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
  // attach cookies to the response
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      id: user._id,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.createdAt
    }
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('You are not registered with us. Please sign up.')
  }
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    throw new UnauthenticatedError('Incorrect credentails.')
  }
  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role
  }
  // attach cookies to the response
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      id: user._id,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.createdAt
    }
  })
}

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).end()
}

module.exports = {
  register,
  login,
  logout
}
