const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description cannot be more than 100 characters']
    },
    image: {
      type: String
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: {
        values: ['office', 'kitchen', 'bedroom'],
        message: '{VALUE} is not supported category'
      }
    },
    company: {
      type: String,
      required: [true, 'Please provide product company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported company'
      }
    },
    colors: {
      type: [String],
      required: [true, 'Please provide product colors']
    },
    featured: {
      type: Boolean,
      default: false
    },
    freeShiping: {
      type: Boolean,
      default: false
    },
    inventory: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    numOfReviews: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtuals
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
})

// remove hook
ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id })
  next()
})

module.exports = mongoose.model('Product', ProductSchema)
