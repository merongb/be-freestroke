const { selectReviewsByLocationId , insertReview, removeReview } = require("../models/reviews_model");


exports.getReviewsByLocationId = (req, res, next) => {
    const locationId = req.params.location_id;

    if (!Number.isInteger(Number(locationId))) {
        return res.status(400).send({ message: "Bad Request" });
    }

    selectReviewsByLocationId(locationId)
    .then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch((err) => {
        next(err);
    });
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