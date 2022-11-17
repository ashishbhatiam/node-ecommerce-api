const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  uploadImageLocal
} = require('../controllers/productController')
const { getSingleProductReviews } = require('../controllers/reviewController')
const {
  authenticateUserMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role } = require('../utils')

router
  .route('/')
  .get(getAllProducts)
  .post(
    [authenticateUserMiddleware, authorizePermissonsMiddleware(admin_role)],
    createProduct
  )

router
  .route('/uploadImage')
  .post(
    [authenticateUserMiddleware, authorizePermissonsMiddleware(admin_role)],
    uploadImage
  )

router
  .route('/uploadImageLocal')
  .post(
    [authenticateUserMiddleware, authorizePermissonsMiddleware(admin_role)],
    uploadImageLocal
  )

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(
    [authenticateUserMiddleware, authorizePermissonsMiddleware(admin_role)],
    updateProduct
  )
  .delete(
    [authenticateUserMiddleware, authorizePermissonsMiddleware(admin_role)],
    deleteProduct
  )

router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router
