const { db } = require('../../connection');
const mongoose = require('mongoose');
const locationData = require('../data/test-data/locations')
const reviewData = require('../data/test-data/reviews')


const locationIdCounterSchema = new mongoose.Schema({
  location_id: {
      type: Number,
      default: 1,
  },
});

const locationSchema = new mongoose.Schema({
  location_id: Number,
  coordinates: [Number],
  created_at: Number,
  location_name: String,
  location_area: String,
  location_img_url: String,
  body: String,
  review_count: Number,
  water_classification: String,
  water_classification_date: String
},
{ versionKey: false }
);

const LocationModel = mongoose.model("Location", locationSchema)

locationSchema.pre('save', async function (next) {
  if (!this.location_id) {
      const counter = await LocationIdCounter.findOneAndUpdate({}, { $inc: { location_id: 1 } }, { upsert: true })
      this.location_id = counter.location_id
  }
  next()
})

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
        const locationsWithIds = locationData.map((location, index) => ({
          ...location,
          location_id: index + 1,
      }))
        return Promise.all([
          LocationModel.insertMany(locationsWithIds),
          ReviewModel.insertMany(reviewData),
        ])
      }).catch((err) => {
        console.log(err);
      })

  }
  
  module.exports = { LocationModel, ReviewModel, seedData }