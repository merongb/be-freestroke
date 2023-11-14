const locationsRouter = require("express").Router()
const {getAllLocations,getLocationById, postLocation} = require("../controllers/locations_controller")
const {	getReviewsByLocationId, postReview } = require("../controllers/reviews_controller");

locationsRouter.get("/", getAllLocations);
locationsRouter.get("/:location_id", getLocationById);
locationsRouter.post("/", postLocation)
locationsRouter.get("/:location_id/reviews", getReviewsByLocationId )
locationsRouter.post("/:location_id/reviews", postReview)


module.exports = locationsRouter