const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')
const { formatBytes } = require('../utils')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const createProduct = async (req, res) => {
  req.body.user = req.user.id
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json(product)
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
    .sort('-createdAt')
    .populate({ path: 'user', select: 'name email' })

  res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req, res) => {
  const productId = req.params.id
  const product = await Product.findOne({ _id: productId }).populate({
    path: 'user',
    select: 'name email'
  })

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
  }).populate({ path: 'user', select: 'name email' })

  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  res.status(StatusCodes.OK).json(product)
}

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }

  await product.remove()
  res.status(StatusCodes.OK).end()
}

const uploadImageLocal = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new BadRequestError('Please provide product image file.')
  }
  const productImage = req.files.image
  // File type validation
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload Image type file.')
  }

  // File size validation
  const maxSize = 1024 * 2048
  if (productImage.size > maxSize) {
    throw new BadRequestError(
      `Please Upload Image smaller than ${formatBytes(maxSize)}.`
    )
  }

  const imagePath = path.join(
    __dirname,
    '../public',
    `/uploads/${productImage.name}`
  )

  await productImage.mv(imagePath)

  res.status(StatusCodes.CREATED).json({
    image: `/uploads/${productImage.name}`,
    size: formatBytes(productImage.size)
  })
}

const uploadImage = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new BadRequestError('Please provide product image file.')
  }
  const productImage = req.files.image
  // File type validation
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload Image type file.')
  }

  // File size validation
  const maxSize = 1024 * 2048
  if (productImage.size > maxSize) {
    throw new BadRequestError(
      `Please Upload Image smaller than ${formatBytes(maxSize)}.`
    )
  }

  // Creating temp file
  const imagePath = path.join(__dirname, '../tmp/', productImage.name)
  await productImage.mv(imagePath)

  // Upload API call
  const result = await cloudinary.uploader.upload(imagePath, {
    use_filename: true,
    folder:
      process.env.NODE_ENV === 'production'
        ? 'e-commerce-api-live'
        : 'e-commerce-api-dev'
  })

  // Unlink/Removing temp file
  fs.unlinkSync(imagePath)

  res.status(StatusCodes.CREATED).json({
    image: result.secure_url,
    size: formatBytes(result.bytes)
  })
}

module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  uploadImageLocal
}
