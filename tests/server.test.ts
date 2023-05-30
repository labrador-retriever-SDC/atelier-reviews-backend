import request from "supertest";
import createServer from "../src/server";
import dbConnection from '../src/db/index';
import seedData from '../src/db/seed';

import exampleReview from './exampleReview';

describe("API Integration Tests", () => {
  const testDB = dbConnection('test');
  const app = createServer(testDB);
  let server;

  beforeAll(async () => {
    await testDB.sync();
    // await seedData(testDB);
    server = app.listen(7890);
  }, 6500);

  afterAll(async () => {
    await server.close();
    await testDB.drop();
    await testDB.close();
  }, 6500)



  describe('GET /reviews', () => {
    it('should return a 200 status code', (done) => {
      request(app)
        .get("/reviews?product_id=1")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })

    // // Same test written with async-await
    // it('should return a 200 status code', async () => {
    //   const response = await request(app)
    //     .get('/reviews?product_id=1');
    //   expect(response.statusCode).toBe(200);
    // })

    it('should return proper parameters when the product has no reviews', (done) => {
      request(app)
        .get('/reviews?product_id=1000001')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.statusCode).toBe(200);
          expect(res.body.product).toBe('1000001');
          expect(res.body.page).toBe('1');
          expect(res.body.count).toBe('5');
          expect(res.body.reviews).toHaveLength(0);
          return done();
        });
    })

    // // Same test written with async-await
    // it('should return proper parameters when the product has no reviews', async () => {
    //   const response = await request(app)
    //     .get('/reviews?product_id=1000001');
    //   expect(response.statusCode).toBe(200);
    //   expect(response.body.product).toBe('1000001');
    //   expect(response.body.page).toBe('1');
    //   expect(response.body.count).toBe('5');
    //   expect(response.body.reviews).toHaveLength(0);
    // })
  });

  describe('GET /reviews/meta', () => {
    it('should return a 200 status code and include all required fields', async () => {
      const response = await request(app)
        .get('/reviews/meta/?product_id=1');
      expect(response.statusCode).toBe(200);
      expect(response.body.product_id).toBe('1');
      expect(response.body.ratings).toBeDefined;
      expect(response.body.recommended).toBeDefined;
      expect(response.body.Characteristics).toBeDefined;
    })

    it('should return proper parameters when the product has no reviews', async () => {
      const response = await request(app)
        .get('/reviews/meta?product_id=1000001');
      expect(response.statusCode).toBe(200);
      expect(response.body.product_id).toBe('1000001');
      expect(response.body.ratings).toMatchObject({});
      expect(response.body.recommended).toMatchObject({});
      expect(response.body.Characteristics).toBeDefined;
    })
  });

  describe('POST /reviews', () => {
    test('should return a 201 status code', (done) => {
      request(app)
        .post('/reviews')
        .send(exampleReview)
        .expect(201)
        .end((err, response) => {
          // Handle errors
          if (err) {
            return done(err);
          }
          done();
        });
    })
  });


})