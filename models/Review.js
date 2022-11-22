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
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    comment: {
      type: String,
      required: [true, 'please provide review text'],
      maxlength: [1500, 'Comment cannot be more than 1500 characters']
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

// Static Functions (used in a schema/model) to calculate Product Average rating & No. of reviews
ReviewSchema.statics.calculateAverageRating = async function (productID) {
  const result = await this.aggregate([
    // Stage 1
    {
      $match: {
        product: productID
      }
    },
    // Stage 2
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: '$rating'
        },
        numOfReviews: {
          $sum: 1
        }
      }
    }
  ])
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productID },
      {
        averageRating: result[0]?.averageRating || 0,
        numOfReviews: result[0]?.numOfReviews || 0
      }
    )
  } catch (error) {
    console.log('error: ', error)
  }
}

// save hook
ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

// remove hook
ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
