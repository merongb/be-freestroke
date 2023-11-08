const mongoose = require('mongoose')
const devData = require("../data/development-data/index")
const { LocationModel, ReviewModel, seedData } = require('./seed');

mongoose.connection.on('open', () => {
  seedData(devData, LocationModel, ReviewModel)
    .then(() => {
      mongoose.connection.close()
    })

})
