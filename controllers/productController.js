const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const createProduct = async (req, res) => {
  req.body.user = req.user.id
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json(product)
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort('-createdAt')
  res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req, res) => {
  const productId = req.params.id
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  res.status(StatusCodes.OK).json(product)
}

const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const {
    name,
    price,
    image,
    colors,
    company,
    description,
    category,
    featured,
    freeShiping,
    inventory
  } = req.body

  const values = {
    name,
    price,
    image,
    colors,
    company,
    description,
    category,
    featured,
    freeShiping,
    inventory
  }

  if ((!name, !price, !company, !description, !category)) {
    throw new BadRequestError(
      'Please provide name, price, company, description & category.'
    )
  }
  const product = await Product.findOneAndUpdate({ _id: productId }, values, {
    new: true,
    runValidators: true
  })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  res.status(StatusCodes.OK).json(product)
}

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findByIdAndDelete({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  res.status(StatusCodes.NO_CONTENT).end()
}

const uploadImage = async (req, res) => {
  res.send('Upload Product Image')
}

module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteProduct
}
