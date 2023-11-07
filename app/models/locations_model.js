const mongoose = require('mongoose')

exports.selectAllLocations = () => {
    const LocationModel = mongoose.model("Location")

    return LocationModel.find({})
    .then((locations) => {
        return locations
    })
}

exports.fetchLocationById = (location_id) => {
const LocationModel = mongoose.model("Location")

return LocationModel.find({ location_id })
        .then((location) => {
            if (location.length === 0) {
                return Promise.reject({ status: 404, message: 'Location Does Not Exist!' })
            }
            return location;
        })

        
}