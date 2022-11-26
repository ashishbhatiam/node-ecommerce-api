const {
  createJWTtoken,
  isTokenValid,
  attachCookiesToResponse
} = require('./jwt')
const { admin_role, user_role, stripe_status } = require('./constants')
const createTokenUser = require('./createTokenUser')
const checkPermission = require('./checkPermission')
const { formatBytes } = require('./helper')

module.exports = {
  createJWTtoken,
  isTokenValid,
  attachCookiesToResponse,
  admin_role,
  user_role,
  stripe_status,
  createTokenUser,
  checkPermission,
  formatBytes
}
