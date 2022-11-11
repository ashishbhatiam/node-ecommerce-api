const { UnauthenticatedError } = require('../errors')
const { admin_role } = require('./constants')

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === admin_role) return
  if (requestUser.id === resourceUserId.toString()) return
  throw new UnauthenticatedError('Unauthorized to access this route.')
}

module.exports = checkPermission
