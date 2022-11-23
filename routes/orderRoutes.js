const express = require('express')
const router = express.Router()
const {
  authenticateUserMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
} = require('../controllers/orderController')

router
  .route('/')
  .get(
    [authenticateUserMiddleware, authorizePermissonsMiddleware('admin')],
    getAllOrders
  )
  .post(authenticateUserMiddleware, createOrder)
router
  .route('/showAllMyOrders')
  .get(authenticateUserMiddleware, getCurrentUserOrders)
router
  .route('/:id')
  .get(authenticateUserMiddleware, getSingleOrder)
  .patch(authenticateUserMiddleware, updateOrder)

module.exports = router
