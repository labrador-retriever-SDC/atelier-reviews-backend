"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = exports.getReviewsMeta = exports.reportReview = exports.markHelpful = exports.getReviews = void 0;
/* eslint-disable camelcase */
var sequelize_1 = require("sequelize");
// import db from '../db/index'
var models_1 = require("../db/models");
var getReviews = function (productID, count, sort, page) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        order = '';
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
        return [2 /*return*/, models_1.Review.findAll({
                where: { product_id: Number(productID), reported: false },
                limit: Number(count),
                offset: Math.max(Number(page) - 1, 0) * Number(count),
                attributes: [['id', 'review_id'], 'rating', 'summary', 'recommend',
                    'response', 'body', 'date', 'reviewer_name', 'helpfulness'],
                order: [[order, 'DESC']],
                include: { model: models_1.Photo, attributes: ['id', 'url'] }
                // raw: true
            })];
    });
}); };
exports.getReviews = getReviews;
var getReviewsMeta = function (productID) { return __awaiter(void 0, void 0, void 0, function () {
    var RatingCount, ratings, RecommendCount, recommended, sqlString, charWithAvgValue, Characteristics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Review.findAll({
                    where: { product_id: Number(productID) },
                    attributes: ['rating', [sequelize_1.Sequelize.fn('COUNT', 'rating'), 'ratingCnt']],
                    group: 'rating',
                    raw: true
                })];
            case 1:
                RatingCount = _a.sent();
                ratings = {};
                RatingCount.forEach(function (x) {
                    var rating = x.rating, ratingCnt = x.ratingCnt;
                    ratings[rating] = ratingCnt;
                });
                return [4 /*yield*/, models_1.Review.findAll({
                        where: { product_id: Number(productID) },
                        attributes: ['recommend', [sequelize_1.Sequelize.fn('COUNT', 'recommend'), 'recommendCnt']],
                        group: 'recommend',
                        raw: true
                    })];
            case 2:
                RecommendCount = _a.sent();
                recommended = {};
                RecommendCount.forEach(function (x) {
                    var recommend = x.recommend, recommendCnt = x.recommendCnt;
                    recommended[recommend] = recommendCnt;
                });
                sqlString = "(SELECT avg(value)::numeric(18, 16)\n      FROM characteristics_reviews\n      WHERE char_id = characteristics.id)";
                return [4 /*yield*/, models_1.Characteristic.findAll({
                        where: { product_id: Number(productID) },
                        attributes: ['name', 'id', [sequelize_1.Sequelize.literal(sqlString), 'value'],
                        ],
                        raw: true,
                    })];
            case 3:
                charWithAvgValue = _a.sent();
                Characteristics = {};
                charWithAvgValue.forEach(function (x) {
                    var name = x.name, id = x.id, value = x.value;
                    Characteristics[name] = { id: id, value: value };
                });
                return [2 /*return*/, { product_id: productID, ratings: ratings, recommended: recommended, Characteristics: Characteristics }];
        }
    });
}); };
exports.getReviewsMeta = getReviewsMeta;
var addReview = function (newReview) { return __awaiter(void 0, void 0, void 0, function () {
    var product_id, rating, summary, body, recommend, name, email, createdReview, review_id_1, photos, characteristics, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                product_id = newReview.product_id, rating = newReview.rating, summary = newReview.summary, body = newReview.body, recommend = newReview.recommend, name = newReview.name, email = newReview.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.Review.create({
                        product_id: product_id,
                        rating: rating,
                        summary: summary,
                        body: body,
                        recommend: recommend,
                        reviewer_name: name,
                        reviewer_email: email,
                        date: Date.now()
                    })];
            case 2:
                createdReview = _a.sent();
                review_id_1 = createdReview.toJSON().id;
                /**
                 * add new photos, if any
                 */
                if (newReview.photos.length > 0) {
                    photos = newReview.photos.map(function (url) {
                        var obj = { review_id: review_id_1, url: url };
                        return obj;
                    });
                    models_1.Photo.bulkCreate(photos);
                }
                characteristics = Object.keys(newReview.characteristics)
                    .map(function (char_id) {
                    var obj = { char_id: char_id, review_id: review_id_1, value: newReview.characteristics[char_id] };
                    return obj;
                });
                models_1.CharacteristicsReview.bulkCreate(characteristics);
                return [2 /*return*/, undefined];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, err_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addReview = addReview;
var markHelpful = function (reviewID) {
    return models_1.Review.increment({ helpfulness: 1 }, { where: { id: Number(reviewID) } });
};
exports.markHelpful = markHelpful;
var reportReview = function (reviewID) {
    return models_1.Review.update({ reported: true }, { where: { id: Number(reviewID) } });
};
exports.reportReview = reportReview;
