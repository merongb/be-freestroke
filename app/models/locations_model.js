const mongoose = require('mongoose')
const {LocationModel, ReviewModel} = require("../../db/seeds/seed")

exports.fetchAllLocations = (distance, sort_by = 'created_at', order = 'desc', limit = 10, p = 1) => {
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
    .then(async ([locations, totalCount]) => {
        const locationIds = locations.map(location => location.location_id);
        const avgRatings = await ReviewModel.aggregate([
            { 
                $match: { location_id: { $in: locationIds } }
            },
            {
                $group: {
                    _id: "$location_id",
                    avg_rating: { $avg: "$rating_for_location" }
                }
            }
        ]);

        const locationsWithAvg = locations.map(location => {
            const avgRatingData = avgRatings.find(data => data._id === location.location_id);
            const avg_rating = avgRatingData ? avgRatingData.avg_rating : null;
            return { ...location.toObject(), avg_rating };
        });

        const output = { locations: locationsWithAvg, total_count: totalCount };
        return output;
    });
};

exports.fetchLocationById = (location_id) => {
    return Promise.all([
        LocationModel.find({ location_id }),
        ReviewModel.aggregate([
            {
                $match: { location_id: parseInt(location_id, 10) }
            },
            {
                $group: {
                    _id: "$location_id",
                    avg_rating: { $avg: "$rating_for_location" }
                }
            }
        ])
    ])
    .then(([locations, avgRatings]) => {
        if (locations.length === 0) {
            return Promise.reject({ status: 404, message: 'Location Does Not Exist!' });
        }
        const location = locations[0];
        const avg_rating = avgRatings.length > 0 ? avgRatings[0].avg_rating : null;
        return { ...location.toObject(), avg_rating: avg_rating };
    });
};

exports.insertLocation = (newLocation) => {
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
    .then((savedLocation) => { return savedLocation
    })
    })
}