const mongoose = require('mongoose');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `${__dirname}/../.env.${ENV}`
});

if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL not set')
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});


function dropAndCreateTestDatabase(callback) {
    if (process.env.NODE_ENV === 'test') {
      mongoose.connection.dropDatabase(() => {
        console.log('Dropped the test database')
        mongoose.connection.db.createCollection('test-database', () => {
          console.log('Created the test database')
          mongoose.connection.close(() => {
            callback()
          })
        })
      })
    }
  }
  dropAndCreateTestDatabase()

module.exports = mongoose.connection;
