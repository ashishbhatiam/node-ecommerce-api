const createProduct = async (req, res) => {
  res.send('Create Product')
}

const getAllProducts = async (req, res) => {
  res.send('Get All Products')
}

const getSingleProduct = async (req, res) => {
  res.send('Get Single Product')
}

const updateProduct = async (req, res) => {
  res.send('Update Product')
}

const uploadImage = async (req, res) => {
  res.send('Upload Product Image')
}

const deleteProduct = async (req, res) => {
  res.send('Delete Product')
}

module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct
}
