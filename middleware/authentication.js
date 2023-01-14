const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { isTokenValid, attachCookiesToResponse } = require('../utils')
const Token = require('../models/Token')

const authenticateUserMiddleware = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      const { name, id, role } = payload.user
      req.user = {
        name,
        id,
        role
      }
      return next()
    }
    const payload = isTokenValid(refreshToken)
    const {
      user: { name, id: userId, role },
      refreshToken: refreshTokenJWT
    } = payload
    const isTokenExists = await Token.findOne({ user: userId, refreshTokenJWT })
    if (!isTokenExists || !isTokenExists?.isValid) {
      throw new UnauthenticatedError('Authentication failed')
    }
    req.user = {
      name,
      id: userId,
      role
    }
    attachCookiesToResponse(res, req.user, refreshTokenJWT)
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
