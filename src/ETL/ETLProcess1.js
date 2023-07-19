const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Transform } = require('stream');

// const reviewsCsvFilePath = path.join(__dirname, '../db/data/reviews.csv');
// const photosCsvFilePath = path.join(__dirname, '../db/data/reviews_photos.csv');
// const characteristicsCsvFilePath = path.join(__dirname, '../db/data/characteristics.csv');
// const charReviewsCsvFilePath = path.join(__dirname, '../db/data/characteristic_reviews.csv');

const reviewsCsvFilePath = path.join(__dirname, '../db/data/reviewsExample.csv');
const photosCsvFilePath = path.join(__dirname, '../db/data/photosExample.csv');
const characteristicsCsvFilePath = path.join(__dirname, '../db/data/charExample.csv');
const charReviewsCsvFilePath = path.join(__dirname, '../db/data/charReviewExample.csv');


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

const characteristicsTransformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const productID = chunk.product_id;
    const meta = metaData[productID] || initialMeta(productID);
    meta.characteristics[chunk.name] = { id: chunk.id, value: null };
    metaData[productID] = meta;
    callback();
  }
});

const charReviewsTransformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const charID = chunk.characteristic_id;
    charReviewTotal[charID] = charReviewTotal[charID] || 0;
    charReviewTotal[charID] += Number(chunk.value);
    callback();
  }
});

const reviewsTransformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
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
    callback();
  }
});

const photosTransformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const reviewID = chunk.review_id;
    reviews[reviewID].photos.push(chunk.url);
    callback();
  }
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
  console.time('Done writing new files.');
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(characteristicsCsvFilePath)
        .pipe(csv())
        .pipe(characteristicsTransformStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    await new Promise((resolve, reject) => {
      fs.createReadStream(charReviewsCsvFilePath)
        .pipe(csv())
        .pipe(charReviewsTransformStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    await new Promise((resolve, reject) => {
      fs.createReadStream(reviewsCsvFilePath)
        .pipe(csv())
        .pipe(reviewsTransformStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    await new Promise((resolve, reject) => {
      fs.createReadStream(photosCsvFilePath)
        .pipe(csv())
        .pipe(photosTransformStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    console.log('All CSV files processed successfully.');
    insertCharValues();
  } catch (error) {
    console.error('Error occurred during processing:', error);
  } finally {
    reviewsWriteStream.write(JSON.stringify(Object.values(reviews), null, 2));
    reviewsWriteStream.end();
    reviewsMetaWriteStream.write(JSON.stringify(Object.values(metaData), null, 2));
    reviewsMetaWriteStream.end();
    console.timeLog('Done writing new files.');
  }
};

run();