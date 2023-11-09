const mongoose = require("mongoose");
const { ReviewModel} = require("../../db/seeds/seed")

exports.fetchReviewsForLocation = (location_id, limit=10, p=1) => {
    const numericLocationId = Number(location_id);
    const offset = (p - 1) * limit

    if (isNaN(numericLocationId) || isNaN(offset)) {
        return Promise.reject({ status: 400, message: "Bad Request" });
    }

    const query = ReviewModel
    .find({ location_id: numericLocationId })
    .sort({ created_at: -1 })
    .skip(offset)
    .limit(limit);

    return Promise.all([
        query.exec(),
        ReviewModel.countDocuments({ location_id: numericLocationId }),
        
    ])
        .then(([reviews, totalCount]) => {
        const output = { reviews: reviews, total_count: totalCount };
        return output;
        });
};

exports.insertReview = (newReview, location_id, next) => {
    const { username, uid, body, rating_for_location } = newReview;
    const votes_for_review = 0;
    const created_at = new Date(Date.now())

    return ReviewModel.findOne({}, { review_id: 1 }, { sort: { review_id: -1 } })
        .then((maxReview) => {
            const newReviewId = maxReview ? maxReview.review_id + 1 : 1;

    const reviewDocument = new ReviewModel({
        review_id: newReviewId,
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
    })
};

exports.removeReview = (review_id) => {
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


exports.updateReviewVotes = (reviewId, voteChange) => {
    const numericVoteChange = Number(voteChange);

    if (isNaN(numericVoteChange)) {
        return Promise.reject({ status: 400, message: "Bad Request" });
    }

    return ReviewModel.findOneAndUpdate(
        { review_id: reviewId },
        { $inc: { votes_for_review: numericVoteChange } },
        { new: true }
    )
    .then((review) => {
        if (!review) {
            return Promise.reject({ status: 404, message: "Not Found" });
        }
        return review;
    });
}