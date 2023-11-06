const {
    selectAllLocations
} = require("../models/locations_model")

exports.getAllLocations = (req, res, next) => {
    selectAllLocations().then((locations) => {
        res.status(200).send({locations})
    })
    .catch((err) => {
        next(err)
    })
}