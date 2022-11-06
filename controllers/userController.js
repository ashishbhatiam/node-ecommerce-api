const getAllUsers = async (req, res) => {
  res.send('Get All Users!')
}

const getSingleUser = async (req, res) => {
  res.send('Get Single User!')
}

const getCurrentUser = async (req, res) => {
  res.send('Get Current User!')
}

const updateUser = async (req, res) => {
  res.send('Update User!')
}

const updateUserPassword = async (req, res) => {
  res.send('Update User Password!')
}

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
}
