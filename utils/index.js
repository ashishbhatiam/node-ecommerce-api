const {
  createJWTtoken,
  isTokenValid,
  attachCookiesToResponse
} = require('./jwt')
const { admin_role, user_role } = require('./constants')
const createTokenUser = require('./createTokenUser')
const checkPermission = require('./checkPermission')

module.exports = {
  createJWTtoken,
  isTokenValid,
  attachCookiesToResponse,
  admin_role,
  user_role,
  createTokenUser,
  checkPermission
}
