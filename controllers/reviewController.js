const createReview = async (req, res) => {
  res.send('Create Review')
}

const getAllReviews = async (req, res) => {
  res.send('Get All Reviews')
}

const getSingleReview = async (req, res) => {
  res.send('Get Single Review')
}

const updateReview = async (req, res) => {
  res.send('Update Review')
}

const deleteReview = async (req, res) => {
  res.send('Delete Review')
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
}
