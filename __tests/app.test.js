const request = require("supertest");
const app = require("../app/app");
const db = require("../connection");
// const seed = require("../);
// const data = require("../");
const sorted = require("jest-sorted");
const endpoints = require("../endpoints.json");


beforeEach(() => seed(data));
afterAll(() => db.end());
describe('', () => {
    test('should ', () => {
        
    });
    
});