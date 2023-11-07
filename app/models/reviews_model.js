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