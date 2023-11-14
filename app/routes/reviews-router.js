const reviewsRouter = require("express").Router()
const { patchVotesByReviewId, deleteReview } = require("../controllers/reviews_controller");


reviewsRouter.patch("/:review_id", patchVotesByReviewId)
reviewsRouter.delete("/:review_id", deleteReview)

module.exports = reviewsRouter