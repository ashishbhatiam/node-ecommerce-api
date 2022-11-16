const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { checkPermission } = require('../utils')

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
  const { productId } = req.query

  if (!productId) {
    throw new BadRequestError(`please provide product.`)
  }

  const reviews = await Review.find({ product: productId }).sort('-createdAt')
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review found with id: ${reviewId}.`)
  }

  res.status(StatusCodes.OK).json(review)
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { title, comment, rating } = req.body
  let review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review found with id: ${reviewId}.`)
  }

  checkPermission(req.user, review.user)

  review.title = title
  review.comment = comment
  review.rating = rating
  await review.save()
  res.status(StatusCodes.OK).json(review)
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({
    _id: reviewId
  })
  if (!review) {
    throw new NotFoundError(`No review found with id: ${reviewId}.`)
  }
  checkPermission(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).end()
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
}
