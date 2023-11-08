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

    const location = new LocationModel({
        username,
        uid,
        coordinates: coordinates,
        location_name: location_name,
        location_area: location_area,
        body: body,
        location_img_url: location_img_url,
        created_at,
      })

      return location.save()
      .then((savedLocation) => {
        return savedLocation
      })
}