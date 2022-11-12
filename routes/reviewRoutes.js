const express = require('express')
const router = express.Router()
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController')
const { authenticateUserMiddleware } = require('../middleware/authentication')

router
  .route('/')
  .get(getAllReviews)
  .post(authenticateUserMiddleware, createReview)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUserMiddleware, updateReview)
  .delete(authenticateUserMiddleware, deleteReview)

module.exports = router
