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
const {
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role } = require('../utils')

router
  .route('/')
  .get(getAllProducts)
  .post(authorizePermissonsMiddleware(admin_role), createProduct)

router
  .route('/uploadImage')
  .post(authorizePermissonsMiddleware(admin_role), uploadImage)

  router
  .route('/uploadImageLocal')
  .post(authorizePermissonsMiddleware(admin_role), uploadImageLocal)

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authorizePermissonsMiddleware(admin_role), updateProduct)
  .delete(authorizePermissonsMiddleware(admin_role), deleteProduct)

module.exports = router
