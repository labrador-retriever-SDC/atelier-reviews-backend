"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacteristicsReview = exports.Characteristic = exports.Photo = exports.Review = void 0;
var sequelize_1 = require("sequelize");
var index_1 = __importDefault(require("../db/index"));
var db = (0, index_1.default)();
// Schemas
var Review = db.define('reviews', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    date: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        get: function () {
            var dateInMS = this.getDataValue('date');
            return new Date(Number(dateInMS));
        },
    },
    summary: sequelize_1.DataTypes.STRING,
    body: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: false,
        validate: { len: [50, 1000] }
    },
    recommend: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    reported: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    reviewer_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    reviewer_email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    response: {
        type: sequelize_1.DataTypes.STRING,
        get: function () {
            var value = this.getDataValue('response');
            return value === 'null' ? null : value;
        }
    },
    helpfulness: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
}, {
    timestamps: false,
    indexes: [{ unique: false, fields: ['product_id'] }]
});
exports.Review = Review;
var Photo = db.define('photos', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    review_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Review, key: 'id' }
    },
    url: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    // indexes: [{ unique: false, fields: ['review_id'] }]
});
exports.Photo = Photo;
var Characteristic = db.define('characteristics', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    indexes: [{ unique: false, fields: ['product_id'] }]
});
exports.Characteristic = Characteristic;
var CharacteristicsReview = db.define('characteristics_reviews', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    char_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: Characteristic, key: 'id' }
    },
    review_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: Review, key: 'id' }
    },
    value: { type: sequelize_1.DataTypes.DECIMAL(5, 4), allowNull: false }
}, {
    timestamps: false,
    indexes: [{ unique: false, fields: ['char_id'] }]
});
exports.CharacteristicsReview = CharacteristicsReview;
// Reviews -> Photos: One-to-Many
Review.hasMany(Photo, { foreignKey: 'review_id' });
Photo.belongsTo(Review, { foreignKey: 'review_id' });
