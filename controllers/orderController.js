const Product = require('../models/Product')
const Order = require('../models/Order')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const getAllOrders = async (req, res) => {
  res.send('Get All Orders')
}

const getSingleOrder = async (req, res) => {
  res.send('Get Single Order')
}

const getCurrentUserOrders = async (req, res) => {
  res.send('Get Current User Orders')
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
  res.send('Update Order')
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
}
