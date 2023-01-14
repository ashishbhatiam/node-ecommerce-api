const express = require('express')
const router = express.Router()

const {
  register,
  login,
  logout,
  verifyEmail
} = require('../controllers/authController')

const { authenticateUserMiddleware } = require('../middleware/authentication')

router.post('/login', login)
router.post('/register', register)
router.delete('/logout', authenticateUserMiddleware, logout)
router.post('/verify-email', verifyEmail)

module.exports = router
