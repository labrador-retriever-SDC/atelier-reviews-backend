/* eslint-disable import/no-extraneous-dependencies */
import request from "supertest";
import createServer from "../src/server";
// import dbConnection from '../src/db/index';

// beforeEach((done) => {
//   const db = dbConnection();
//   db.authenticate()
//     .then(() => done())
//     .catch((error) =>
//       console.error('Unable to connect to the database:', error))
// });

// afterEach((done) => {
//   mongoose.connection.db.dropDatabase(() => {
//     mongoose.connection.close(() => done());
//   });
// });

// let app, server;

// beforeAll(() => {
//  app = createServer();
//  server = app.listen(5555);
// })

// afterAll(() => {
//   server.close()
// });


describe('GET /reviews', () => {
  const app = createServer();
  it('should return a 200 status code', async () => {
    const response = await request(app)
      .get('/reviews?product_id=1');
    expect(response.statusCode).toBe(200);

  })

  it('should return proper parameters when the product has no reviews', async () => {
    const response = await request(app)
      .get('/reviews?product_id=1000001');
    expect(response.statusCode).toBe(200);
    expect(response.body.product).toBe('1000001');
    expect(response.body.page).toBe('1');
    expect(response.body.count).toBe('5');
    expect(response.body.reviews).toHaveLength(0);

  })
});