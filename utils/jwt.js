const jwt = require('jsonwebtoken')

const createJWTtoken = payload => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

const isTokenValid = token => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = (res, user, refreshToken) => {
  const accessTokenJWT = createJWTtoken({ user })
  const refreshTokenJWT = createJWTtoken({ user, refreshToken })
  const thirtyDays = 1000 * 60 * 60 * 24 * 30

  // setup accessToken cookie
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000
  })

  // setup refreshToken cookie
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + thirtyDays),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  })
}

module.exports = {
  createJWTtoken,
  isTokenValid,
  attachCookiesToResponse
}
