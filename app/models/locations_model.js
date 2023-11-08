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

exports.insertLocation = (newLocation) => {
    const LocationModel = mongoose.model("Location")

    const {coordinates, location_name, location_area, body, location_img_url,username, uid,  } = newLocation
    const created_at = new Date(Date.now())


    return LocationModel.findOne({}, { location_id: 1 }, { sort: { location_id: -1 } })
    .then((maxLocation) => {
        const newLocationId = maxLocation ? maxLocation.location_id + 1 : 1;


    const location = new LocationModel({
        username,
        uid,
        coordinates,
        location_name,
        location_area,
        body,
        location_img_url,
        created_at,
        location_id: newLocationId
    });

      return location.save()
      .then((savedLocation) => {
        return savedLocation
      })
    })
}