const getAllUsers = async (req, res) => {
  res.send('Get All Users!')
}

const getSingleUser = async (req, res) => {
  res.send(req.params)
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
