const mongoose = require('mongoose');
const dotenv = require('dotenv')

const ENV = process.env.NODE_ENV || 'test';
dotenv.config({
  path: `${__dirname}/../.env.${ENV}`
  
})
if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL not set')
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
})


function dropAndCreateTestDatabase() {
  if (process.env.NODE_ENV === 'test') {
    return mongoose.connection.dropDatabase()
      .then(() => {
        return mongoose.connection.db.createCollection('test-database');
      })
      .then(() => {
      })
  }
}

  dropAndCreateTestDatabase()

  module.exports = {
    db: mongoose.connection,
    dropAndCreateTestDatabase,
  }
  
