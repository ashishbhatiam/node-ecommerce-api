const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUserMiddleware = (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new UnauthenticatedError('Authentication failed')
  }
  try {
    const payload = isTokenValid(token)
    req.user = {
      name: payload.name,
      id: payload.id,
      role: payload.role
    }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication failed')
  }
}

const authorizePermissonsMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route.')
    }
    next()
  }
}

module.exports = {
  authenticateUserMiddleware,
  authorizePermissonsMiddleware
}
