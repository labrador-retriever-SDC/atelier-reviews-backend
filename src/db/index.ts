import { Sequelize, DataTypes, Deferrable } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

// Create a database connection and export it from this file.
// Confirm that the credentials supplied for the connection are correct.

// pass in a connection uri
// Example for postgres
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbName')

dotenv.config();

const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const dbHost = process.env.DB_HOST || '';

const db = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'postgres'
});

const testConnection = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection();



// define data structure
const Reviews = db.define('reviews', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  date: {
    type: DataTypes.BIGINT,
    defaultValue: DataTypes.NOW
  },
  summary: DataTypes.STRING,
  body: { type: DataTypes.STRING(1000), allowNull: false },
  recommend: { type: DataTypes.BOOLEAN, allowNull: false },
  reported: { type: DataTypes.BOOLEAN, defaultValue: false },
  reviewer_name: { type: DataTypes.STRING, allowNull: false },
  reviewer_email: { type: DataTypes.STRING, allowNull: false },
  response: DataTypes.STRING,
  helpfulness: { type: DataTypes.INTEGER, defaultValue: 0 },
},{
  timestamps: false
});

const Photos = db.define('photos', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  review_id: {
    type: DataTypes.INTEGER,
    references: {model: Reviews, key: 'id', deferrable: new Deferrable.INITIALLY_IMMEDIATE() }
  },
  url: { type: DataTypes.STRING, allowNull: false }
},{
  timestamps: false
})

const Characteristics = db.define('characteristics', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
},{
  timestamps: false
})

const CharacteristicsReviews = db.define('characteristics_reviews', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  char_id: { type: DataTypes.INTEGER, allowNull: false },
  review_id: {
    type: DataTypes.INTEGER,
    references: {model: Reviews, key: 'id', deferrable: new Deferrable.INITIALLY_IMMEDIATE() }
  },
  value: { type: DataTypes.DECIMAL(5, 4), allowNull: false }
},{
  timestamps: false
})


/**
 * Seeding data by executing seed.sql
 */
db.sync()
  .then(() => Reviews.count())
  .then((count) => {
    // run seed.sql only if Reviews is empty
    if (count === 0) {
      const sqlString = fs.readFileSync(path.join(__dirname, '/seed.sql'), 'utf8');
      return db.query(sqlString);
    }
    return undefined;
  })
  .then(() => console.log("Done seeding data."))
  .catch(err => console.log("Error seeding data", err))
  .then(() => process.exit());


export { db, Reviews, Photos, Characteristics, CharacteristicsReviews };
