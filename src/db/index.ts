import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const dbHost = process.env.DB_HOST || '';

// Create a database connection
// we can also pass in a connection uri, for example,
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbName')
const db = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'postgres',
  logging: false
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



// Schemas
const Review = db.define('reviews', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  date: {
    type: DataTypes.BIGINT,
    allowNull: false,
    get() {
      const dateInMS = this.getDataValue('date');
      return new Date(Number(dateInMS));
    },
  },
  summary: DataTypes.STRING,
  body: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: { len: [50, 1000] }
  },
  recommend: { type: DataTypes.BOOLEAN, allowNull: false },
  reported: { type: DataTypes.BOOLEAN, defaultValue: false },
  reviewer_name: { type: DataTypes.STRING, allowNull: false },
  reviewer_email: { type: DataTypes.STRING, allowNull: false },
  response: {
    type: DataTypes.STRING,
    get() {
      const value = this.getDataValue('response');
      return value === 'null' ? null : value;
    }
  },
  helpfulness: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['product_id'] }]
});

const Photo = db.define('photos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  review_id: {
    type: DataTypes.INTEGER,
    references: { model: Review, key: 'id' }
  },
  url: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false,
  // indexes: [{ unique: false, fields: ['review_id'] }]
})

const Characteristic = db.define('characteristics', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['product_id'] }]
})

const CharacteristicsReview = db.define('characteristics_reviews', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  char_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Characteristic, key: 'id' }
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Review, key: 'id' }
  },
  value: { type: DataTypes.DECIMAL(5, 4), allowNull: false }
}, {
  timestamps: false,
  indexes: [{ unique: false, fields: ['char_id'] }]
})

// Reviews -> Photos: One-to-Many
Review.hasMany(Photo, { foreignKey: 'review_id' });
Photo.belongsTo(Review, { foreignKey: 'review_id' });
// This creates the `review_id` foreign key in Photos.

// Characteristic -> CharacteristicsReview: One-to-Many
// Characteristic.hasMany(CharacteristicsReview, { foreignKey: 'char_id' });
// CharacteristicsReview.belongsTo(Characteristic, { foreignKey: 'char_id' });

/**
 * Seeding data by executing seed.sql
 */
db.sync()
  .then(() => Review.count())
  .then((count) => {
    // seed data only if Reviews is empty
    if (count === 0) {
      console.log('Loading data...', new Date())
      const sqlString = fs.readFileSync(path.join(__dirname, '/seed.sql'), 'utf8');
      return db.query(sqlString);
    }
    return undefined;
  })
  .then(() => {
    // sync tables with the latest id
    const tables = ['reviews', 'photos', 'characteristics', 'characteristics_reviews'];

    tables.forEach(table =>
      db.query(`
      select setval('${table}_id_seq', (select max(id) from ${table}), true);
      `))
  })
  .catch(err => console.log("Error seeding data", err))
  .finally(() => console.log("Done seeding data.", new Date()))


export { db, Review, Photo, Characteristic, CharacteristicsReview };
