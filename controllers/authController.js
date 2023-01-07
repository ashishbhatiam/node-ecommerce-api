const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError
} = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils/index')
const crypto = require('crypto')

const register = async (req, res) => {
  const { name, password, email } = req.body
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError(
      'Email already exists, Please try a different email.'
    )
  }
  const verificationToken = crypto.randomBytes(40).toString('hex')
  const user = await User.create({ name, password, email, verificationToken })

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify acoount',
    verificationToken: user.verificationToken
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

  if (!user.isVerified) {
    throw new UnauthenticatedError('Please verify your email.')
  }

  const tokenUser = createTokenUser(user)
  // attach cookies to the response
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.OK).json({
    user: tokenUser
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
