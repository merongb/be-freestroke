const request = require("supertest");
const app = require("../app/app");
const db = require("../connection");
const {seedData} = require("../db/seeds/seed");
const { LocationModel, ReviewModel } = require("../db/seeds/seed");
const {locationsData, reviewsData} = require("../db/data/test-data/index");
const sorted = require("jest-sorted");
const mongoose = require("mongoose");


beforeEach(async () => await seedData(locationsData, reviewsData, LocationModel, ReviewModel));

afterAll(() => mongoose.connection.close());

describe('GET /api/locations', () => {
    test('should return a 200 status code ', () => {
        return request(app).get("/api/locations").expect(200)
    });
    test('an array of location objects should be returned', () => {
        return request(app).get("/api/locations").expect(200).then(({body}) => {
            expect(body.locations).toHaveLength(9)
        })
    });
    test('return a 404 error when given a wrong path ', () => {
        return request(app).get("/api/banana").expect(404).then(({body}) => {
        })
    });
});

describe('GET /api/locations/:location_id', () => {
    test('returns a 200 status code', () => {
        return request(app).get("/api/locations/9").expect(200)
    }); 
    test('returns a location by the id with the following properties', () => {
        return request(app).get("/api/locations/9").expect(200).then(({body}) => {
           expect(body.location[0]).toHaveProperty("coordinates", expect.any(Array));
           expect(body.location[0]).toHaveProperty("location_name", expect.any(String));
           expect(body.location[0]).toHaveProperty("location_area", expect.any(String));
           expect(body.location[0]).toHaveProperty("location_img_url", expect.any(String));
           expect(body.location[0]).toHaveProperty("water_classification", expect.any(String));
           expect(body.location[0]).toHaveProperty("water_classification_date", expect.any(String));
        })
    });
    test("should return a status code of 404 Not Found for a location_id that does not exist", () => {
        return request(app)
          .get("/api/locations/99")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe('Location Does Not Exist!')
          });
      });

});

describe("GET /api/locations/:location_id/reviews", () => {
    test("should return a status code of 200 with an array of reviews for the given location_id, ordered by latest", () => {
      return request(app)
        .get("/api/locations/1/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.reviews)).toBe(true);
          expect(body.reviews).toHaveLength(2);
          expect(body.reviews).toBeSorted({ descending: true, key: "created_at" });
          body.reviews.forEach((review) => {
            expect(review).toHaveProperty("username");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("body");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("location_id");
          });
        });
    });
  
test("should return a status code of 404 Not Found for a location_id that does not exist", () => {
      return request(app)
        .get("/api/locations/99/reviews")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not Found");
        });
    });
  
  
    test("should return a status code of 400 Bad Request for an invalid location_id", () => {
      return request(app)
        .get("/api/locations/nolocation/reviews")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request");
        });
    });
  });