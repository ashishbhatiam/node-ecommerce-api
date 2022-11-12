const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const createReview = async (req, res) => {
  const { product: productId } = req.body
  const { id: userId } = req.user

  // Check Actual Product
  const isProductFound = await Product.findOne({ _id: productId })
  if (!isProductFound) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }

  // Check If Review Unique/Already Submitted
  const isAlreadySubmitted = await Review.findOne({
    product: productId,
    user: userId
  })
  if (isAlreadySubmitted) {
    throw new BadRequestError('Already submitted review for this product.')
  }

  // Create New Review
  req.body.user = userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json(review)
}

const getAllReviews = async (req, res) => {
  res.send('Get All Reviews')
}

const getSingleReview = async (req, res) => {
  res.send('Get Single Review')
}

const updateReview = async (req, res) => {
  res.send('Update Review')
}

const deleteReview = async (req, res) => {
  res.send('Delete Review')
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
}
