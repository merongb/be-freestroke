const mongoose = require('mongoose')

exports.fetchAllLocations = (distance, sort_by = 'created_at', order = 'desc', limit = 10, p = 1) => {
    const LocationModel = mongoose.model("Location")
    const offset = (p - 1) * limit
    const query = LocationModel.find({});

    if (distance) {
        query.where('distance_from_user_km').lte(distance);
    }

    return Promise.all([
        query
            .sort({ [sort_by]: order }) 
            .skip(offset) 
            .limit(limit)
            .exec(),
        LocationModel.countDocuments(query.getQuery()), 
    ])
        .then(([locations, totalCount]) => {
            const output = { locations, total_count: totalCount };
            return output;
        });
};

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