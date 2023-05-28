import { Request, Response } from 'express';
import * as models from '../models/models'


const home = (req: Request, res: Response) => {
  res.json({ message: 'Welcome to SDC 🤗' })
}

/**
 * Parameters:
 * product_id: required
 * count: optional, default = 5
 * page: optional, default = 1
 * sort: optional, default = "relevant"
 */
const getReviews = async (req: Request, res: Response) => {
  const product = req.query.product_id as string;
  const count = req.query.count as string || '5';
  const page = req.query.page as string || '1';
  const sort = req.query.sort as string || 'relevant';

  // invalid product id
  const isNumeric = (value: string) => /^\d+$/.test(value);
  if (!isNumeric(product)) {
    res.status(422).send("Error: invalid product_id provided");
    return;
  }

  models.getReviews(product, count, sort, page)
    .then(reviews => {
      res.status(200).send({ product, page, count, reviews })
    })
    .catch(() => res.status(500).send());
}

const getReviewsMeta = (req: Request, res: Response) => {
  const productID = req.query.product_id as string;

  models.getReviewsMeta(productID)
    .then((result) => res.json(result))
    .catch(() => res.status(500).send());
}

const createReview = (req: Request, res: Response) => {
  models.addReview(req.body)
    .then(() =>  res.sendStatus(201))
    .catch((err) => res.status(500).send(err));
}

const markHelpful = (req: Request, res: Response) => {
  const reviewID = req.params.review_id as string;
  // Status: 204 NO CONTENT
  models.markHelpful(reviewID)
    .then(() => {
      res.status(202).json(`Marked review as helpful: ${reviewID}`);
    })
    .catch(() => res.status(500).send());
}

const reportReview = (req: Request, res: Response) => {
  const reviewID = req.params.review_id as string;
  // Status: 204 NO CONTENT
  models.reportReview(reviewID)
    .then(() => {
      res.status(202).json(`Reported review: ${reviewID}`);
    })
    .catch(() => res.status(500).send());
}


export { home, getReviews, getReviewsMeta, createReview, markHelpful, reportReview }