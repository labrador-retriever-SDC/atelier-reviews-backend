const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/reviews';

const db = mongoose.connect(mongoURI, { useNewUrlParser: true });

const reviewsSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, index: true },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  summary: String,
  body: {
    type: String,
    required: true,
    minLength: 50,
    maxLength: 1000,
  },
  recommend: { type: Boolean, required: true },
  reported: { type: Boolean, default: false, select: false },
  name: { type: String, required: true },
  email: { type: String, required: true, select: false },
  response: { type: Object, default: null},
  helpfulness: { type: Number, defaultValue: 0 },
  photos: [String]
})

const metaSchema = new mongoose.Schema({

})

const Review = mongoose.model('Review', reviewsSchema);

db
  .then(() => console.log(`Connected to: ${mongoURI}`))
  .catch(err => {
    console.log(`There was a problem connecting to mongo at: ${mongoURI}`);
    console.log(err);
  });

module.exports = { db, Review };