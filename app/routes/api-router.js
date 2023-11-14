const apiRouter = require("express").Router()
const locationsRouter = require('./locations-router')
const reviewsRouter = require('./reviews-router')


const { getAllEndpoints } = require("../controllers/endpoints_controller")


apiRouter.get('/', getAllEndpoints)
apiRouter.use("/locations", locationsRouter)
apiRouter.use("/reviews", reviewsRouter)


module.exports = apiRouter