const { db } = require('../../connection');
const mongoose = require('mongoose');
const locationData = require('../data/test-data/locations')
const reviewData = require('../data/test-data/reviews')
const {convertReviewDateToISOString, convertLocationDateToISOString} = require('./utils.js')


const locationIdCounterSchema = new mongoose.Schema({
  location_id: {
      type: Number,
      default: 1,
  },
});

const ReviewIdCounterSchema = new mongoose.Schema({
  review_id: {
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

const reviewSchema = new mongoose.Schema({
  uid: {
          type: String,
          required: true,
        },
  review_id: Number,
  username: {
              type: String,
              required: true,
            },
  votes_for_review: Number,
  rating_for_location: Number,
  body: String,
  created_at: String,
  location_id: Number,
},
{ versionKey: false }
)

const ReviewModel = mongoose.model('Review', reviewSchema)

reviewSchema.pre('save', async function (next) {
  if (!this.review_id) {
      const counter = await ReviewIdCounter.findOneAndUpdate({}, { $inc: { review_id: 1 } }, { upsert: true })
      this.review_id = counter.review_id
  }
  next()
})


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
        const reviewsWithIds = reviewData.map((review, index) => ({
          ...review,
          review_id: index + 1,
        }))
        const convertedLocationData = locationsWithIds.map(convertLocationDateToISOString)
        const convertedReviewData = reviewsWithIds.map(convertReviewDateToISOString)

        return Promise.all([
          LocationModel.insertMany(convertedLocationData),
          ReviewModel.insertMany(convertedReviewData),
        ])
      }).catch((err) => {
        console.log(err);
      })

  }
  
  module.exports = { LocationModel, ReviewModel, seedData }