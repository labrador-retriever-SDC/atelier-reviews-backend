import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let dbUser = '';
let dbPass = '';
let dbHost = '';
let dbName = '';

switch (process.env.NODE_ENV) {
  case "test":
    dbUser = process.env.DB_USER_TEST;
    dbPass = process.env.DB_PASS_TEST;
    dbHost = process.env.DB_HOST_TEST;
    dbName = process.env.DB_NAME_TEST;
    break;
  case "prod":
    dbUser = process.env.DB_USER_PROD;
    dbPass = process.env.DB_PASS_PROD;
    dbHost = process.env.DB_HOST_PROD;
    dbName = process.env.DB_NAME_PROD;
    break;
  default:
    dbUser = process.env.DB_USER;
    dbPass = process.env.DB_PASS;
    dbHost = process.env.DB_HOST;
    dbName = process.env.DB_NAME;
}


const dbConnection = () =>
  new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'postgres',
    // benchmark: true,
    // logging(sql, timing) {
    //   console.log(`[Execution time: ${timing}ms]
    //    -  ${sql} \n`)
    // },
    logging: false
  });
;

// // Testing connection
// db.authenticate()
//   .then(() =>
//     console.log('Connection has been established successfully.'))
//   .catch((error) =>
//     console.error('Unable to connect to the database:', error));


export default dbConnection;
