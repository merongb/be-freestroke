const { selectReviewsByLocationId } = require("../models/reviews_model");


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