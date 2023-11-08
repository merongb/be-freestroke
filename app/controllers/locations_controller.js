const {
    fetchAllLocations,
    fetchLocationById
} = require("../models/locations_model")

exports.getAllLocations = (req, res, next) => {
    const { distance, sort_by, order, limit, p } = req.query

    fetchAllLocations(distance, sort_by, order, limit, p)
    .then(({ locations, total_count}) => {
        res.status(200).send({locations, total_count})
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