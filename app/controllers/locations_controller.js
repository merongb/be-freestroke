const {
    selectAllLocations,
    fetchLocationById
} = require("../models/locations_model")

exports.getAllLocations = (req, res, next) => {
    selectAllLocations().then((locations) => {
        res.status(200).send({locations})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getLocationById = (req, res, next) => {
const {location_id} = req.params

fetchLocationById(location_id).then((location) => {
    res.status(200).send({ location })
})
.catch((err) => {
    next(err)
})
}