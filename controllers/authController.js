const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError
} = require('../errors')
const {
  attachCookiesToResponse,
  createTokenUser,
  sendEmailLocal,
  sendEmail
} = require('../utils/index')
const crypto = require('crypto')
const Token = require('../models/Token')

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
  const origin = `${req.protocol}://${req.get('host')}`
  const link = `${origin}/user/verify-email?token=${user.verificationToken}&email=${user.email}`

  const msgText = `<h4>Hey ${user.name}, </h4><p>Verify your email by clicking the <a href="${link}">link</a>.</p>`
  await sendEmailLocal(user.email, 'Email Confirmation', msgText)
  // await sendEmail(user.email, 'Email Confirmation', msgText)

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify acoount'
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

  let refreshToken = ''

  // check existing refreshToken
  const isTokenExists = await Token.findOne({ user: user._id })
  if (isTokenExists) {
    if (!isTokenExists.isValid) {
      throw new UnauthenticatedError('Incorrect credentails.')
    }
    refreshToken = isTokenExists.refreshToken
    // attach cookies to the response
    attachCookiesToResponse(res, tokenUser, refreshToken)

    res.status(StatusCodes.OK).json({
      user: tokenUser
    })
    return
  }

  // create new refreshToken
  const userAgent = req.get('user-agent')
  const ip = req.ip
  refreshToken = crypto.randomBytes(40).toString('hex')
  const userToken = {
    userAgent,
    ip,
    user: user._id,
    refreshToken
  }
  await Token.create(userToken)

  // attach cookies to the response
  attachCookiesToResponse(res, tokenUser, refreshToken)

  res.status(StatusCodes.OK).json({
    user: tokenUser
  })
}

const logout = async (req, res) => {
  const { id: userId } = req.user
  await Token.findOneAndDelete({ user: userId })

  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).end()
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body
  let user = await User.findOne({ email, verificationToken })
  if (!user) {
    throw new UnauthenticatedError('Incorrect verificationToken or email.')
  }
  if (user.isVerified) {
    throw new BadRequestError('The account is already verified.')
  }

  user.verificationToken = ''
  user.isVerified = true
  user.verified = Date.now()

  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Account verified successfully!' })
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail
}
