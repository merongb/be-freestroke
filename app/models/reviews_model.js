const mongoose = require("mongoose");

exports.selectReviewsByLocationId = (locationId) => {
    const ReviewModel = mongoose.model("Review");

    const numericLocationId = Number(locationId);

    if (isNaN(numericLocationId)) {
        return Promise.reject({ status: 400, message: "Bad Request" });
    }

    return ReviewModel
        .find({ location_id: numericLocationId })
        .sort({ created_at: -1 }) 
        .then((reviews) => {
            if (reviews.length === 0) {
                return Promise.reject({ status: 404, message: "Not Found" });
            }
            return reviews;
        });
};

exports.insertReview = (newReview, location_id, next) => {
    const ReviewModel = mongoose.model("Review");

    const { username, uid, body, rating_for_location } = newReview;
    const votes_for_review = 0;
    const created_at = new Date(Date.now())

    const reviewDocument = new ReviewModel({
        username,
        uid,
        body,
        rating_for_location,
        votes_for_review,
        created_at,
        location_id,
    });

    return reviewDocument.save()
        .then((savedReview) => {
            return savedReview;
        })
};

exports.removeReview = (review_id) => {
    const ReviewModel = mongoose.model("Review");

    const numericReviewId = Number(review_id);
    
    if (isNaN(numericReviewId)) {
        return Promise.reject({ status: 400, message: "Bad Request" });
    }

    return ReviewModel
        .findOneAndDelete({ review_id: numericReviewId })
        .then((removedReview) => {
            if (!removedReview) {
                return Promise.reject({ status: 404, message: "Review not found" });
            }
            return removedReview
        });
};