const { fetchReviewsForLocation , insertReview, removeReview } = require("../models/reviews_model");
const { fetchLocationById } = require('../models/locations_model')

exports.getReviewsByLocationId = (req, res, next) => {
    const location_id = req.params.location_id;
    const { limit, p } = req.query

    if (!Number.isInteger(Number(location_id))) {
        return res.status(400).send({ message: "Bad Request" });
    }

    Promise.all([
        fetchReviewsForLocation(location_id, limit, p ),
        location_id && fetchLocationById(location_id)
    ])
    .then((results) => {
        const [reviews, location] = results
        if(location && reviews.length === 0) {
            res.status(200).send({reviews: [], total_count: reviews.total_count})
        } else {
            res.status(200).send(reviews)
        }
    })
    .catch((err) => {
        next(err)
    })
};

exports.postReview = (req, res, next) => {
    const newReview = req.body
    const { location_id } = req.params
    
    insertReview(newReview, location_id, next)
    .then((review) => {
        res.status(201).send({review})
    })
    .catch((err)=>{
        next(err);
    })
}

exports.deleteReview = (req,res,next) => {
    const { review_id } = req.params

    removeReview(review_id).then((review)=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}