"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var dbName = process.env.DB_NAME || '';
var dbUser = process.env.DB_USER || '';
var dbPass = process.env.DB_PASS || '';
var dbHost = process.env.DB_HOST || '';
// Create a database connection
// we can also pass in a connection uri, for example,
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbName')
var db = new sequelize_1.Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'postgres',
    // benchmark: true,
    // logging(sql, timing) {
    //   console.log(`[Execution time: ${timing}ms]
    //    -  ${sql} \n`)
    // },
    logging: false
});
var dbConnection = function () { return db; };
// // Testing connection
// db.authenticate()
//   .then(() =>
//     console.log('Connection has been established successfully.'))
//   .catch((error) =>
//     console.error('Unable to connect to the database:', error));
exports.default = dbConnection;
