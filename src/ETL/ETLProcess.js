const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const reviewsCsvFilePath = path.join(__dirname, '../db/data/reviews.csv');
const photosCsvFilePath = path.join(__dirname, '../db/data/reviews_photos.csv');
const characteristicsCsvFilePath = path.join(__dirname, '../db/data/characteristics.csv');
const charReviewsCsvFilePath = path.join(__dirname, '../db/data/characteristic_reviews.csv');

const reviewsReadStream = fs.createReadStream(reviewsCsvFilePath);
const photosReadStream = fs.createReadStream(photosCsvFilePath);
const characteristicsReadStream = fs.createReadStream(characteristicsCsvFilePath);
const charReviewsReadStream = fs.createReadStream(charReviewsCsvFilePath);

const reviewsJSONFilePath = path.join(__dirname, '../db/data/reviews.json');
const reviewsMetaJSONFilePath = path.join(__dirname, '../db/data/reviewsMeta.json');

const reviewsWriteStream = fs.createWriteStream(reviewsJSONFilePath);
const reviewsMetaWriteStream = fs.createWriteStream(reviewsMetaJSONFilePath);

const reviews = {};
const metaData = {};
const charReviewTotal = {};

const initialMeta = (productID) => ({
  product_id: productID,
  ratings: {},
  recommended: {},
  characteristics: {},
  count: 0
});

const parseCharacteristics = () =>
  new Promise((resolve, reject) => {
    characteristicsReadStream
      .pipe(csv())
      .on('data', (chunk) => {
        const productID = chunk.product_id;
        const meta = metaData[productID] || initialMeta(productID);
        meta.characteristics[chunk.name] = { id: chunk.id, value: null };
        metaData[productID] = meta;
      })
      .on('end', () => {
        console.log('Characteristics CSV file processed.');
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

const parseCharReviews = () =>
  new Promise((resolve, reject) => {
    charReviewsReadStream
      .pipe(csv())
      .on('data', (chunk) => {
        const charID = chunk.characteristic_id;
        charReviewTotal[charID] = charReviewTotal[charID] || 0;
        charReviewTotal[charID] += Number(chunk.value);
      })
      .on('end', () => {
        console.log('Characteristics_Reviews CSV file processed.');
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

const parseReviews = () =>
  new Promise((resolve, reject) => {
    reviewsReadStream
      .pipe(csv())
      .on('data', (chunk) => {
        const reviewID = chunk.id;
        const productID = chunk.product_id;

        const meta = metaData[productID] || initialMeta(productID);
        const ratingCount = meta.ratings[chunk.rating] || 0;
        meta.ratings[chunk.rating] = ratingCount + 1;

        const recommendCount = meta.recommended[chunk.recommend] || 0;
        meta.recommended[chunk.recommend] = recommendCount + 1;

        meta.count += 1;

        metaData[productID] = meta;

        const currentReview = {
          id: parseInt(reviewID, 10),
          product_id: parseInt(productID, 10),
          rating: parseInt(chunk.rating, 10),
          date: new Date(parseInt(chunk.date, 10)),
          summary: chunk.summary,
          body: chunk.body,
          recommend: chunk.recommend === 'true',
          reported: chunk.reported === 'true',
          name: chunk.reviewer_name,
          email: chunk.reviewer_email,
          response: chunk.response === 'null' ? null : chunk.response,
          helpfulness: chunk.helpfulness,
          photos: [],
        };

        reviews[reviewID] = currentReview;
      })
      .on('end', () => {
        console.log('Reviews CSV file processed.');
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

const parsePhotos = () =>
  new Promise((resolve, reject) => {
    photosReadStream
      .pipe(csv())
      .on('data', (chunk) => {
        const reviewID = chunk.review_id;
        reviews[reviewID].photos.push(chunk.url);
      })
      .on('end', () => {
        console.log('Photo CSV file processed.');
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

const insertCharValues = () => {
  Object.keys(metaData).forEach(metaKey => {
    const { characteristics, count } = metaData[metaKey];
    // console.log(characteristics, count)
    Object.keys(characteristics).forEach(charName => {
      const char = characteristics[charName];

      // console.log(char)
      const total = charReviewTotal[char.id];
      if (total > 0) {
        char.value = (total / count).toFixed(16);
      } else {
        char.value = null;
      }
    })
  })
}

const run = async () => {
  console.time('Done writing new files.')
  try {
    await parseCharacteristics();
    await parseCharReviews();
    await parseReviews();
    await parsePhotos();
    console.log('All CSV files processed successfully.');
    insertCharValues();
  } catch (error) {
    console.error('Error occurred during processing:', error);
  } finally {
    reviewsWriteStream.write(JSON.stringify(Object.values(reviews), null, 2))
    reviewsWriteStream.end();
    reviewsMetaWriteStream.write(JSON.stringify(Object.values(metaData), null, 2))
    reviewsMetaWriteStream.end();
    console.timeLog('Done writing new files.')
  }
};

run();