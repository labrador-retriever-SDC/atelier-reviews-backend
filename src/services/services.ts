/* eslint-disable camelcase */
import { Sequelize } from 'sequelize';
import createModels from '../models/models';

const servicesLogic = (db) => {

const { Review, Photo, Characteristic, CharacteristicsReview } = createModels(db);

const getReviews = async (productID: string, count: string, sort: string, page: string) => {
  let order = '';
  switch (sort) {
    case 'helpful':
      order = 'helpfulness';
      break;
    case 'newest':
      order = 'date';
      break;
    default:
      // TODO: relevant
      order = 'helpfulness';
      break;
  }
  return Review.findAll({
    where: { product_id: Number(productID), reported: false },
    limit: Number(count),
    offset: Math.max(Number(page) - 1, 0) * Number(count),
    attributes: [['id', 'review_id'], 'rating', 'summary', 'recommend',
      'response', 'body', 'date', 'reviewer_name', 'helpfulness'],
    order: [[order, 'DESC']],
    include: { model: Photo, attributes: ['id', 'url'] },
    benchmark: true,
    // logging(sql, timing) {
    //   console.log(`\n[Execution time: ${timing}ms]
    //   - get reviews
    //   finding reviews for product ${productID}
    //   with sort=${sort} page=${page} count=${count} \n`)
    // },
    // raw: true
  })
}

const getReviewsMeta = async (productID: string) => {
  // // testing
  // const countAll = await Review.count({
  //   where: { product_id: Number(productID) }
  // })
  // console.log(countAll)

  /**
   * Rating Breakdown
   */
  const RatingCount: Array<any> = await Review.findAll({
    where: { product_id: Number(productID) },
    attributes: ['rating', [Sequelize.fn('COUNT', 'rating'), 'ratingCnt']],
    group: 'rating',
    raw: true,
    benchmark: true,
    // logging(sql, timing) {
    //   console.log(`\n[Execution time: ${timing}ms]
    //   - get reviews metadata
    //   count ratings for product ${productID} \n`)
    // },
  })
  const ratings = {};
  RatingCount.forEach(x => {
    const { rating, ratingCnt } = x;
    ratings[rating] = ratingCnt;
  })

  /**
   * Recommend Breakdown
   */
  const RecommendCount: Array<any> = await Review.findAll({
    where: { product_id: Number(productID) },
    attributes: ['recommend', [Sequelize.fn('COUNT', 'recommend'), 'recommendCnt']],
    group: 'recommend',
    raw: true,
    benchmark: true,
    // logging(sql, timing) {
    //   console.log(`\n[Execution time: ${timing}ms]
    //   - get reviews metadata
    //   count recommendation for product ${productID} \n`)
    // },
  })
  const recommended = {};
  RecommendCount.forEach(x => {
    const { recommend, recommendCnt } = x;
    recommended[recommend] = recommendCnt;
  })


  /**
   * Characteristics Breakdown
   */
  const sqlString = `(SELECT avg(value)::numeric(18, 16)
      FROM characteristics_reviews
      WHERE char_id = characteristics.id)`;
  const charWithAvgValue: Array<any> = await Characteristic.findAll({
    where: { product_id: Number(productID) },
    attributes: ['name', 'id', [Sequelize.literal(sqlString), 'value'],
    ],
    raw: true,
    benchmark: true,
    // logging(sql, timing) {
    //   console.log(`\n[Execution time: ${timing}ms]
    //   - get reviews metadata
    //   find average characteristics for product ${productID} \n`)
    // },
  })
  const Characteristics = {};
  charWithAvgValue.forEach(x => {
    const { name, id, value } = x;
    Characteristics[name] = { id, value };
  })

  return { product_id: productID, ratings, recommended, Characteristics };
};

const addReview = async (newReview: any) => {
  const {
    product_id, rating, summary, body, recommend, name, email
  } = newReview;

  try {
    /**
    * add new review
    */
    const createdReview = await Review.create({
      product_id, rating, summary, body, recommend,
      reviewer_name: name,
      reviewer_email: email,
      date: Date.now()
    }, {
      benchmark: true,
      // logging(sql, timing) {
      //   console.log(`\n[Execution time: ${timing}ms]
      //   - create new review, update review table \n`)
      // },
    })
    const { id: review_id } = createdReview.toJSON();

    /**
     * add new photos, if any
     */
    if (newReview.photos.length > 0) {
      const photos = newReview.photos.map((url: string) => {
        const obj = { review_id, url };
        return obj;
      })
      Photo.bulkCreate(photos, {
        benchmark: true,
        // logging(sql, timing) {
        //   console.log(`\n[Execution time: ${timing}ms]
        //     - create new review, update photo table \n`)
        // },
      })
      .catch(err => console.log('ERROR adding photos', err))
    }

    /**
     * add characteristics reviews
     */
    const characteristics = Object.keys(newReview.characteristics)
      .map((char_id: string) => {
        const obj = { char_id, review_id, value: newReview.characteristics[char_id] };
        return obj;
      })
    CharacteristicsReview.bulkCreate(characteristics, {
      benchmark: true,
      // logging(sql, timing) {
      //   console.log(`\n[Execution time: ${timing}ms] \n\t - create new review, update CharacteristicsReview table \n`)
      // },
    })
    .catch(err => console.log('ERROR adding Chars', err))

    return undefined;
  } catch (err) {
    return err;
  }
}


const markHelpful = (reviewID: string) =>
  Review.increment(
    { helpfulness: 1 },
    {
      where: { id: Number(reviewID) },
      benchmark: true,
      // logging(sql, timing) {
      //   console.log(`\n[Execution time: ${timing}ms]
      //   - marked review ${reviewID} helpful  \n`)
      // },
    },
  );


const reportReview = (reviewID: string) =>
  Review.update(
    { reported: true },
    {
      where: { id: Number(reviewID) },
      benchmark: true,
      // logging(sql, timing) {
      //   console.log(`\n[Execution time: ${timing}ms]
      //   - reported review ${reviewID}  \n`)
      // },
    },
  );

  return { getReviews, markHelpful, reportReview, getReviewsMeta, addReview };
}

export default servicesLogic;
