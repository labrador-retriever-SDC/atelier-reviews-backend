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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var controllers = __importStar(require("./controllers/controllers"));
var app = express();
dotenv_1.default.config();
app.use(express.json());
app.use((0, cors_1.default)());
app.use(express.urlencoded({ extended: true }));
/**
 * Routes
 */
app.get('/', controllers.home);
app.get('/reviews', controllers.getReviews);
app.get('/reviews/meta', controllers.getReviewsMeta);
app.post('/reviews', controllers.createReview);
app.put('/reviews/:review_id/helpful', controllers.markHelpful);
app.put('/reviews/:review_id/report', controllers.reportReview);
var PORT = process.env.PORT || 3000;
try {
    app.listen(PORT, function () { console.log("Now running on http://localhost:".concat(PORT)); });
}
catch (error) {
    console.log('Error ocurred');
}
