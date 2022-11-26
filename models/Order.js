const mongoose = require('mongoose')

const SingleOrderItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true
  }
})

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true
    },
    shippingFees: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: {
        values: ['pending', 'failed', 'paid', 'delivered', 'cancelled'],
        message: '{VALUE} is not supported status'
      },
      default: 'pending'
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clientSecret: {
      type: String,
      required: true
    },
    paymentIntentId: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('order', OrderSchema)
