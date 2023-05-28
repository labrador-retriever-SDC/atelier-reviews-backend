import { Application } from 'express';
import express = require('express');
import cors from 'cors';
import dotenv from 'dotenv';

import * as controllers from './controllers/controllers'

const app: Application = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


/**
 * Routes
 */
app.get('/', controllers.home);

app.get('/reviews', controllers.getReviews)
app.get('/reviews/meta', controllers.getReviewsMeta)
app.post('/reviews', controllers.createReview)
app.put('/reviews/:review_id/helpful', controllers.markHelpful)
app.put('/reviews/:review_id/report', controllers.reportReview)


const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, () => {console.log(`Now running on http://localhost:${PORT}`)})
} catch (error) {
  console.log('Error ocurred')
}