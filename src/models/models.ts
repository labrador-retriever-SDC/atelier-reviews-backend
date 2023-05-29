import { DataTypes } from 'sequelize';
import dbConnection from '../db/index'

const db = dbConnection();

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

export { Review, Photo, Characteristic, CharacteristicsReview  }