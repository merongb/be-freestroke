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


return LocationModel.findOne({location_id})
.then((location) => {
    if (location){
        return location
    }   else {
        return Promise.reject({status : 404, message : 'Location Does Not Exist!'})
    }
})
}