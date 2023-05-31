import { Application } from 'express';
import cors from 'cors';
import getControllers from './controllers/controllers'

const express = require('express');
const logger = require('morgan');

const createServer = (db) => {
  const app: Application = express();
  const controllers = getControllers(db);

  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({extended: true}));
  app.use(logger(':method :url :status - :response-time ms'))

  /**
   * Routes
   */
  app.get('/', controllers.home);
  app.get('/reviews', controllers.getReviews)
  app.get('/reviews/meta', controllers.getReviewsMeta)
  app.post('/reviews', controllers.createReview)
  app.put('/reviews/:review_id/helpful', controllers.markHelpful)
  app.put('/reviews/:review_id/report', controllers.reportReview)
  // Mismatch URL
  app.all('*', controllers.noSuchPage);
  return app;
}

export default createServer;