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
        return request(app).get("/api/banana").expect(404)
    });
});

describe('GET /api/locations/:location_id', () => {
    test('returns a 200 status code', () => {
        return request(app).get("/api/locations/9").expect(200)
    }); 
    test('returns a location by the id with the following properties', () => {
        return request(app).get("/api/locations/9").expect(200).then(({body}) => {
           expect(body.location).toHaveProperty("coordinates", expect.any(Array));
           expect(body.location).toHaveProperty("location_name", expect.any(String));
           expect(body.location).toHaveProperty("location_area", expect.any(String));
           expect(body.location).toHaveProperty("location_img_url", expect.any(String));
           expect(body.location).toHaveProperty("water_classification", expect.any(String));
           expect(body.location).toHaveProperty("water_classification_date", expect.any(String));
        })
    });

});