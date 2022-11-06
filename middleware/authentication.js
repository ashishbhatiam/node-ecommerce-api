const { UnauthenticatedError } = require('../errors')
const { isTokenValid } = require('../utils')
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new UnauthenticatedError('Authentication failed')
  }
  try {
    const payload = isTokenValid(token)
    req.user = {
      name: payload.name,
      id: payload._id,
      role: payload.role
    }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication failed')
  }
}

module.exports = authenticateUser
