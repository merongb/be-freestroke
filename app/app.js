const express = require("express")
const app = express()
app.use(express.json())


const {
    getAllEndpoints
} = require('../controllers/endpoints_controller');

const {
    getAllEndpoints,
	getAllLocations,
    getLocationById,
    getReviewsById,
    postReview,
    patchLocationById,
    removeReview,
} = require('../controllers/locations_controller');




const { handleMongoErrors, handleErrors } = require("./db/error-handler");


app.get("/api", getAllEndpoints);
app.get("/api/locations", getAllLocations);
app.get("/api/locations/:location_id", getLocationById);
app.get("/api/location/:location_id/reviews", getReviewsById )
app.post("/api/location/:location_id/reviews", postReview)
app.patch("/api/locations/:location_id", patchLocationById)
app.delete("/api/location/:location_id/reviews", removeReview)

app.use(handleMongoErrors)
app.use(handleErrors)



app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});


module.exports = app;
