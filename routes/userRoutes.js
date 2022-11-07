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
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role } = require('../utils')

router.route('/').get(authorizePermissonsMiddleware(admin_role), getAllUsers)
router.route('/me').get(getCurrentUser)
router.route('/updateUser').patch(updateUser)
router.route('/updateUserPassword').patch(updateUserPassword)
router.route('/:id').get(getSingleUser)

module.exports = router
