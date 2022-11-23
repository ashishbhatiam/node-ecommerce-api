const getAllOrders = async (req, res) => {
  res.send('Get All Orders')
}

const getSingleOrder = async (req, res) => {
  res.send('Get Single Order')
}

const getCurrentUserOrders = async (req, res) => {
  res.send('Get Current User Orders')
}

const createOrder = async (req, res) => {
  res.send('Create Order')
}

const updateOrder = async (req, res) => {
  res.send('Update Order')
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
}
