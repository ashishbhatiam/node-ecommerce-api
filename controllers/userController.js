const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

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
  res.send('Get Current User!')
}

const updateUser = async (req, res) => {
  res.send(req.body)
}

const updateUserPassword = async (req, res) => {
  res.send(req.body)
}

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
}
