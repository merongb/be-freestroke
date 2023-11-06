const mongoose = require('mongoose')

exports.selectAllLocations = () => {
    const LocationModel = mongoose.model("Location")

    return LocationModel.find({})
    .then((locations) => {
        return locations
    })
}