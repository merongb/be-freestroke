const mongoose = require('mongoose')
const locationData = require('../data/test-data/locations')
const reviewData = require('../data/test-data/reviews')
const { LocationModel, ReviewModel, seedData } = require('./seed');


mongoose.connection.on('open', () => {
  seedData(locationData, reviewData, LocationModel, ReviewModel)
    .then(() => {
      mongoose.connection.close()
    })

})
