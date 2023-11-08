const request = require("supertest");
const app = require("../app/app");
const db = require("../connection");
const {seedData} = require("../db/seeds/seed");
const { LocationModel, ReviewModel } = require("../db/seeds/seed");
const {locationsData, reviewsData} = require("../db/data/test-data/index");
const sorted = require("jest-sorted");
const mongoose = require("mongoose");
const endpoints = require("../endpoints.json");


beforeEach(async () => await seedData(locationsData, reviewsData, LocationModel, ReviewModel));

afterAll(() => mongoose.connection.close());

describe("GET /api", () => {
	test("should return all api endpoints with descriptions from endpoints.json", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(endpoints);
			});
	});
});

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
    test('should filter locations based on distance_from_user_km', () => {
        return request(app)
            .get('/api/locations?distance=5')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.locations)).toBe(true);
                expect(body.locations).toHaveLength(5);
            });
    });
    test('should sort locations by created_at in descending order', () => {
        return request(app)
            .get('/api/locations?sort_by=created_at&order=desc')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.locations)).toBe(true);
                expect(body.locations).toBeSortedBy('created_at', {descending: true})
            });
    });
    test('should limit the number of locations returned', () => {
        return request(app)
            .get('/api/locations?limit=3')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.locations)).toBe(true);
                expect(body.locations).toHaveLength(3);
            });
    });
    test('should paginate results', () => {
        return request(app)
            .get('/api/locations?limit=3&p=2')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.locations)).toBe(true);
                expect(body.locations).toHaveLength(3);
                expect(body.total_count).toBe(9)
            });
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
                expect(review).toHaveProperty("votes_for_review");
                expect(review).toHaveProperty("body");
                expect(review).toHaveProperty("created_at");
                expect(review).toHaveProperty("location_id");
                expect(review).toHaveProperty("rating_for_location");
            });
            });
    });
    test('should return 200 status code and an empty array for valid location with no reviews', () => {
        return request(app)
        .get('/api/locations/6/reviews')
        .expect(200)
        .then(({body}) => {
            expect(body.reviews).toHaveLength(0)
            expect(body.reviews).toEqual([])
        })
    })
    test("should return a status code of 404 Not Found for a location_id that does not exist", () => {
        return request(app)
            .get("/api/locations/99/reviews")
            .expect(404)
            .then(({ body }) => {
            expect(body.message).toBe("Location Does Not Exist!");
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
    test('checking limit parameter: should return an object with accurate list of comments and total_count - limit=2, page=default(1)', () => {
        return request(app)
        .get('/api/locations/1/reviews?limit=2')
        .expect(200)
        .then((res) => {
            expect(res.body.total_count).toBe(2)
            expect(res.body.reviews).toMatchObject([{
                                                        _id: expect.any(String),
                                                        body: "Exotic location worth visiting.",
                                                        created_at: "Thu Mar 16 2023 22:20:00 GMT+0000 (Greenwich Mean Time)",
                                                        location_id: 1,
                                                        rating_for_location: 5,
                                                        review_id: 12,
                                                        uid: "LZcUD0th7Tay0l2d6ODKJ8Zfi7s12",
                                                        username: "travelbug",
                                                        votes_for_review: 0
                                                    },
                                                    {
                                                        _id: expect.any(String),
                                                        body: "very cold but pretty safe otherwise",
                                                        created_at: "Fri Oct 09 2020 02:00:00 GMT+0100 (British Summer Time)",
                                                        location_id: 1,
                                                        rating_for_location: 5,
                                                        review_id: 1,
                                                        uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                                                        username: "johndoe",
                                                        votes_for_review: 0
                                                    }])
            })
        });
    test('should return empty reviews array when page entered is higher than number of reviews that we have for that location', async () => {
        return request(app)
        .get('/api/locations/1/reviews?p=5')
        .expect(200)
        .then((res) => {
            expect(res.body.total_count).toBe(2)
            expect(res.body.reviews).toMatchObject([])
        })
    });
    test('should return 400 Bad Request when limit parameter is invalid', async () => {
        return request(app)
        .get('/api/locations/1/reviews?limit=invalid')
        .expect(400)
        .then((res) => {
            expect(res.body.message).toBe('Bad Request');
        })
    });
    test('should return 400 Bad Request when pagination parameter is invalid', async () => {
        return request(app)
        .get('/api/locations/1/reviews?p=invalid')
        .expect(400)
        .then((res) => {
            expect(res.body.message).toBe('Bad Request');
        })
    });
});

describe('POST /api/location/:location_id/reviews', () => {
    test('should return 201 status code and return the new posted review', () => {
        const newReview = {
                            username: "rogershop",
                            uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                            body: "The water is too deep",
                            rating_for_location: 3
                        }
        return request(app)
        .post('/api/location/2/reviews')
        .send(newReview)
        .expect(201)
        .then((res) => {
            expect(res.body.review).toMatchObject({
                                                    username: "rogershop",
                                                    uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                                                    body: "The water is too deep",
                                                    rating_for_location: 3,
                                                    votes_for_review: 0,
                                                    created_at: expect.any(String),
                                                    location_id: 2
                                                    })
        })
    });
    test('should return 201 status code and return the new posted review when passed a request with an extra field', () => {
        const newReview = {
                            username: "rogershop",
                            uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                            body: "The water is too deep",
                            rating_for_location: 3,
                            extraKey: 'extraValue'
                            }
        return request(app)
        .post('/api/location/3/reviews')
        .send(newReview)
        .expect(201)
        .then((res) => {
            expect(res.body.review).toMatchObject({
                                                    username: "rogershop",
                                                    uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                                                    body: "The water is too deep",
                                                    rating_for_location: 3,
                                                    votes_for_review: 0,
                                                    created_at: expect.any(String),
                                                    location_id: 3
                                                })
        })
    });
    test('should return 400 Bad Request if given an invalid location_id',()=>{
        const newReview = {
                            username: "rogershop",
                            uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                            body: "The water is too deep",
                            rating_for_location: 3,
                            }
        return request(app)
        .post('/api/location/notAnID/reviews')
        .send(newReview)
        .expect(400)
        .then(({body})=>{
            expect(body.message).toBe('Bad request')
        })
    })
    test('should return a 400 Bad Request if the object passed is incorrectly formatted - key is name rather than username',()=>{
        const newReview = {
                            name: "rogershop",
                            uid: "LZcUD0th7Tay0l2d6ODkJ8Zfi7s1",
                            body: "The water is too deep",
                            rating_for_location: 3,
                            }
        return request(app)
        .post('/api/location/1/reviews')
        .send(newReview)
        .expect(400)
        .then ((res)=>{
            expect(res.body.message).toBe('Bad request')
        })
    })
    test('should return a 400 Bad Request if the object passed is missing required properties - missing key uid',()=>{
        const newReview = {
                        username: "rogershop",
                        body: "The water is too deep",
                        rating_for_location: 3,
                        }
        return request(app)
        .post('/api/location/1/reviews')
        .send(newReview)
        .expect(400)
        .then ((res)=>{
            expect(res.body.message).toBe('Bad request')
        })
    })
})

describe("PATCH /api/reviews/:review_id", () => {
	test("should return status code 200 and update votes to specified amount (incremented)", () => {
		const votesBody = { inc_votes: 1 };
		return request(app)
			.patch("/api/reviews/12")
			.send(votesBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.review).toHaveProperty("review_id");
				expect(body.review).toHaveProperty("username");
				expect(body.review).toHaveProperty("votes_for_review");
				expect(body.review).toHaveProperty("body");
				expect(body.review).toHaveProperty("created_at");
				expect(body.review).toHaveProperty("location_id");
				expect(body.review).toHaveProperty("rating_for_location");
				expect(body.review.votes_for_review).toEqual(1);
			});
	});

	test("should return status code 200 and update review votes to specified amount (decremented)", () => {
		const votesBody = { inc_votes: -1 };
		return request(app)
			.patch("/api/reviews/12")
			.send(votesBody)
			.expect(200)
			.then(({ body }) => {
				expect(body.review).toHaveProperty("review_id");
				expect(body.review).toHaveProperty("username");
				expect(body.review).toHaveProperty("votes_for_review");
				expect(body.review).toHaveProperty("body");
				expect(body.review).toHaveProperty("created_at");
				expect(body.review).toHaveProperty("location_id");
				expect(body.review).toHaveProperty("rating_for_location");
				expect(body.review.votes_for_review).toEqual(-1);
			});
	});

	test("should return status code 400 when the vote value is not a number", () => {
		const votesBody = { inc_votes: "abc" };
		return request(app)
			.patch("/api/reviews/12")
			.send(votesBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Bad Request");
			});
	});

	test('should return status code 404 for a review_id that doesn"t exist', () => {
		const votesBody = { inc_votes: 5 };
		return request(app)
			.patch("/api/reviews/99")
			.send(votesBody)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Not Found");
			});
	});

	test("should return status code 400 for an invalid review_id", () => {
		const votesBody = { inc_votes: 3 };
		return request(app)
			.patch("/api/reviews/rubbish")
			.send(votesBody)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Bad Request");
			});
	});
});

describe('DELETE /api/reviews/:review_id',()=>{
    test('should return a 204 status code and no content - specified review_id should be deleted from reviews table',()=>{
        return request(app)
        .delete('/api/reviews/12')
        .expect(204)
        .then(()=>{
            return ReviewModel.findOne({ review_id: 12 });
            })
            .then((foundReview) => {
                expect(foundReview).toBeNull()
        })
    })
    test('should return a 404 if given a review_id that does not exist',()=>{
        return request(app)
        .delete('/api/reviews/999')
        .expect(404).then(({body})=>{
            expect(body.message).toBe('Review not found')
        })
    })
    test('should return a 400 if given an invalid review_id',()=>{
        return request(app)
        .delete('/api/reviews/notAnID')
        .expect(400).then(({body})=>{
            expect(body.message).toBe('Bad Request')
        })
    })
})
describe('POST /api/locations', () => {
  test('returns a 201 status code and the posted location ', () => {
    const newLocation = 
    {
      coordinates: [50.1111, -1.2222],
      location_name: "Brighton square",
      location_area: "Brighton",
      body: "Just a random place in brighton",
      location_img_url: "https://media.istockphoto.com/id/518181226/photo/brighton-ferris-wheel-beachfront-panoramic-view.jpg?s=612x612&w=0&k=20&c=d_itIAgf5mv1PtDHGTak0HMRQl0ANZBKUFBoWrDnG8k=",
      created_at: new Date()
    }
    return request(app).post(`/api/locations`).send(newLocation).expect(201).then(({body}) => {
      expect(body.location).toHaveProperty("location_name", expect.any(String));
      expect(body.location).toHaveProperty("location_area", expect.any(String));
      expect(body.location).toHaveProperty("body", expect.any(String));
      expect(body.location).toHaveProperty("location_img_url", expect.any(String));
      expect(body.location).toHaveProperty("created_at", expect.any(Number));
    })
  });
  test('returns a 400 when given wrong data inputs', () => {
    const newLocation = 
    {
      coordinates: [50.1111, -1.2222],
      location_name: "Brighton square",
      location_area: 123,
      body: 1234,
      location_img_url: 123,
      created_at: new Date()
    }
    return request(app).post(`/api/locations`).send(newLocation).expect(400).then(({body}) => {
      expect(body.message).toBe("Bad Request")
    })
  });
  

});