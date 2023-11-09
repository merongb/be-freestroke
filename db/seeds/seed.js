const { db } = require('../../connection');
const mongoose = require('mongoose');

const {convertReviewDateToISOString, convertLocationDateToISOString} = require('./utils.js')


const locationIdCounterSchema = new mongoose.Schema({
  location_id: {
      type: Number,
      default: 1,
  },
});
const locationIdCounterModel = mongoose.model("Location_id", locationIdCounterSchema)

const ReviewIdCounterSchema = new mongoose.Schema({
  review_id: {
      type: Number,
      default: 1,
  },
});

const locationSchema = new mongoose.Schema({
  location_id: Number,
  coordinates: {
    type: [Number],
    required: true },
  created_at: Number,
  distance_from_user_km: Number,
  location_name: { 
    type: String,
    required: true },
  location_area: { 
    type: String,
    required: true },
  location_img_url: String,
  body: {
    type: String,
    required: true
  },
  review_count: Number,
  water_classification: String,
  water_classification_date: String,
  avg_rating: Number
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
  location_id: Number
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

function seedData({locationData, reviewData}, LocationModel, ReviewModel) {
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
        const avgRatings = reviewData.reduce((acc, review) => {
          const { location_id, rating_for_location } = review;
          if (!acc[location_id]) {
            acc[location_id] = { sum: rating_for_location, count: 1 };
          } else {
            acc[location_id].sum += rating_for_location;
            acc[location_id].count += 1;
          }
          return acc;
        }, {});

        const locationsDataWithAvg = locationsWithIds.map((location) => {
          const { location_id } = location;
          const avgRatingData = avgRatings[location_id];
          const avg_rating = avgRatingData ? avgRatingData.sum / avgRatingData.count : null;
  
          return {
            ...location,
            avg_rating,
          };
        })

        const convertedLocationData = locationsDataWithAvg.map(convertLocationDateToISOString)
        const convertedReviewData = reviewsWithIds.map(convertReviewDateToISOString)

        return Promise.all([
          LocationModel.insertMany(convertedLocationData),
          ReviewModel.insertMany(convertedReviewData),
        ])
      }).catch((err) => {
        console.log(err);
      })

  }
  
  module.exports = { LocationModel, ReviewModel, seedData, locationIdCounterModel }