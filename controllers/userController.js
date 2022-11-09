const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError
} = require('../errors')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users, count: users.length })
}

const getSingleUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id, role: 'user' }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user found with id: ${id}.`)
  }
  res.status(StatusCodes.OK).json(user)
}

const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  res.send(req.body)
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
