const Product = require('../models/Product')
const Order = require('../models/Order')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { checkPermission, stripe_status } = require('../utils')

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order found with id: ${orderId}`)
  }
  checkPermission(req.user, order.user)
  res.status(StatusCodes.OK).json(order)
}

const getCurrentUserOrders = async (req, res) => {
  const currentUserOrders = await Order.find({ user: req.user.id })
  res
    .status(StatusCodes.OK)
    .json({ orders: currentUserOrders, count: currentUserOrders.length })
}

const createOrder = async (req, res) => {
  const { tax, shippingFees, cartItems } = req.body

  if (!cartItems || cartItems?.length < 1) {
    throw new BadRequestError('No cart items provided.')
  }

  if (!tax || !shippingFees) {
    throw new BadRequestError('please provide tax & shipping fee')
  }
  let orderItems = []
  let subtotal = 0
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new NotFoundError(`No product found with id: ${item.product} `)
    }

    const { _id, name, price, image } = dbProduct
    const singleCartItem = {
      name,
      image,
      price,
      amount: item.amount, // Num of item/quantity
      product: _id
    }
    // add item to order list
    orderItems = [...orderItems, singleCartItem]
    // Calculate subtotal
    subtotal += item.amount * price
  }

  // Calculate total
  const total = tax + shippingFees + subtotal

  // Create Stripe Test Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'inr'
  })

  const orderPayload = {
    tax,
    shippingFees,
    subtotal,
    total,
    orderItems,
    user: req.user.id,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  }

  // Create Order
  const order = await Order.create(orderPayload)
  res.status(StatusCodes.CREATED).json(order)
}

const updateOrder = async (req, res) => {
  const { paymentIntentId } = req.body
  const { id: orderID } = req.params

  // Get Order
  let order = await Order.findOne({ _id: orderID })
  if (!order) {
    throw new NotFoundError(`No order found with id: ${orderID}`)
  }

  // Check Permissions
  checkPermission(req.user, order.user)

  // Retrieve Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  // Update order status as per the payment status
  if (paymentIntent.status === stripe_status.succeeded) {
    order.status = 'paid'
  } else if (paymentIntent.status === stripe_status.canceled) {
    order.status = 'cancelled'
  } else if (paymentIntent.status === stripe_status.requires_payment_method) {
    order.status = 'failed'
  }
  await order.save()

  res.status(StatusCodes.OK).json(order)
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
}
