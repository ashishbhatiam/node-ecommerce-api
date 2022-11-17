const express = require('express')
const router = express.Router()
const {
  createReview,
  getAllProductReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getAllReviews
} = require('../controllers/reviewController')
const { authenticateUserMiddleware } = require('../middleware/authentication')

router
  .route('/')
  .get(getAllProductReviews)
  .post(authenticateUserMiddleware, createReview)

router.route('/all').get(getAllReviews)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUserMiddleware, updateReview)
  .delete(authenticateUserMiddleware, deleteReview)

module.exports = router
