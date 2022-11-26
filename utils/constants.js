// roles
const admin_role = 'admin'
const user_role = 'user'

// stripe payment intents status list
const stripe_status = {
  requires_payment_method: 'requires_payment_method',
  canceled: 'canceled',
  succeeded: 'succeeded'
}

module.exports = {
  admin_role,
  user_role,
  stripe_status
}
