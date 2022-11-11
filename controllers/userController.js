const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError
} = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission
} = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password')
  res.status(StatusCodes.OK).json({ users, count: users.length })
}

const getSingleUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user found with id: ${id}.`)
  }
  checkPermission(req.user, user._id)
  res.status(StatusCodes.OK).json(user)
}

const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  const { name, email } = req.body
  if ((!name, !email)) {
    throw new BadRequestError('Please provide name & email.')
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { name, email },
    { new: true, runValidators: true }
  ).select('-password')
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.OK).json(tokenUser)
}

const updateUserPassword = async (req, res) => {
  const { old_password, new_password } = req.body
  if (!old_password || !new_password) {
    throw new BadRequestError('Please provide old & new passwords.')
  }
  const user = await User.findOne({ _id: req.user.id })
  const isPasswordMatch = await user.comparePassword(old_password)
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('Incorrect credentails.')
  }
  user.password = new_password
  await user.save()
  res.status(StatusCodes.OK).end()
}

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
}
