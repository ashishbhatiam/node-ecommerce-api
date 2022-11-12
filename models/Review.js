const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'please provide review rating']
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'please provide review title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
      minlength: [3, 'Title cannot be less than 3 characters']
    },
    comment: {
      type: String,
      required: [true, 'please provide review text'],
      maxlength: [1500, 'Comment cannot be more than 1500 characters'],
      minlength: [5, 'Comment cannot be less than 5 characters']
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  },
  { timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema)
