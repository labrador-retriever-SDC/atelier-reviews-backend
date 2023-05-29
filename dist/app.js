"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server"));
var seed_1 = __importDefault(require("./db/seed"));
var app = (0, server_1.default)();
var PORT = process.env.PORT || 3000;
try {
    (0, seed_1.default)();
    app.listen(PORT, function () { console.log("Now running on http://localhost:".concat(PORT)); });
}
catch (error) {
    console.log('Error ocurred');
}
exports.default = app;
