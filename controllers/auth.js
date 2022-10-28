const User = require('../models/User')

const register = async (req, res) => {
  res.send('Register User!')
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
