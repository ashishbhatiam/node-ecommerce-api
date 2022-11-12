const express = require('express')
const router = express.Router()

const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController')

const {
  authenticateUserMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role } = require('../utils')

router
  .route('/')
  .get(
    [authenticateUserMiddleware, authorizePermissonsMiddleware(admin_role)],
    getAllUsers
  )
router.route('/me').get(authenticateUserMiddleware, getCurrentUser)
router.route('/updateUser').patch(authenticateUserMiddleware, updateUser)
router
  .route('/updateUserPassword')
  .patch(authenticateUserMiddleware, updateUserPassword)
router.route('/:id').get(authenticateUserMiddleware, getSingleUser)

module.exports = router
