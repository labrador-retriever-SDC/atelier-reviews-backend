"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.noSuchPage = exports.reportReview = exports.markHelpful = exports.createReview = exports.getReviewsMeta = exports.getReviews = exports.home = void 0;
var services = __importStar(require("../services/services"));
var home = function (req, res) {
    res.json({ message: 'Welcome to SDC 🤗' });
};
exports.home = home;
var noSuchPage = function (req, res) {
    res.status(404).send({ error: true, message: 'Page not found. Check your URL please' });
};
exports.noSuchPage = noSuchPage;
/**
 * Parameters:
 * product_id: required
 * count: optional, default = 5
 * page: optional, default = 1
 * sort: optional, default = "relevant"
 */
var getReviews = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, count, page, sort, isNumeric;
    return __generator(this, function (_a) {
        product = req.query.product_id;
        count = req.query.count || '5';
        page = req.query.page || '1';
        sort = req.query.sort || 'relevant';
        isNumeric = function (value) { return /^\d+$/.test(value); };
        if (!isNumeric(product)) {
            res.status(422).send("Error: invalid product_id provided");
            return [2 /*return*/];
        }
        services.getReviews(product, count, sort, page)
            .then(function (reviews) {
            res.status(200).send({ product: product, page: page, count: count, reviews: reviews });
        })
            .catch(function () { return res.status(500).send(); });
        return [2 /*return*/];
    });
}); };
exports.getReviews = getReviews;
var getReviewsMeta = function (req, res) {
    var productID = req.query.product_id;
    services.getReviewsMeta(productID)
        .then(function (result) { return res.json(result); })
        .catch(function () { return res.status(500).send(); });
};
exports.getReviewsMeta = getReviewsMeta;
var createReview = function (req, res) {
    services.addReview(req.body)
        .then(function () { return res.sendStatus(201); })
        .catch(function (err) { return res.status(500).send(err); });
};
exports.createReview = createReview;
var markHelpful = function (req, res) {
    var reviewID = req.params.review_id;
    // Status: 204 NO CONTENT
    services.markHelpful(reviewID)
        .then(function () {
        res.status(202).json("Marked review as helpful: ".concat(reviewID));
    })
        .catch(function () { return res.status(500).send(); });
};
exports.markHelpful = markHelpful;
var reportReview = function (req, res) {
    var reviewID = req.params.review_id;
    // Status: 204 NO CONTENT
    services.reportReview(reviewID)
        .then(function () {
        res.status(202).json("Reported review: ".concat(reviewID));
    })
        .catch(function () { return res.status(500).send(); });
};
exports.reportReview = reportReview;
