const { db } = require('../../connection');
const mongoose = require('mongoose');
const locationData = require('../data/test-data/locations')
const reviewData = require('../data/test-data/reviews')

const LocationModel = mongoose.model('Location', new mongoose.Schema({
  coordinates: [Number],
  location_id: Number,
  created_at: Number,
  location_name: String,
  location_area: String,
  location_img_url: String,
  body: String,
  review_count: Number,
  water_classification: String,
},
{ versionKey: false }
));

const ReviewModel = mongoose.model('Review', new mongoose.Schema({
  uid: String,
  review_id: Number,
  username: String,
  votes: Number,
  body: String,
  created_at: Number,
  location_id: Number,
},
{ versionKey: false }
))


function seedData(locationData, reviewData, LocationModel, ReviewModel) {
    
    return Promise.all([
      
      LocationModel.collection.drop(),
      ReviewModel.collection.drop(),
    ])
      .then(() => {
        return Promise.all([
          LocationModel.insertMany(locationData),
          ReviewModel.insertMany(reviewData),
        ])
      }).catch((err) => {
        console.log(err);
      })

  }
  
  module.exports = { LocationModel, ReviewModel, seedData }