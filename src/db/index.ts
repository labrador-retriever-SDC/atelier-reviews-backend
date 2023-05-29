import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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
  // benchmark: true,
  // logging(sql, timing) {
  //   console.log(`[Execution time: ${timing}ms]
  //    -  ${sql} \n`)
  // },
  logging: false
});

const dbConnection = () => db;

// // Testing connection
// db.authenticate()
//   .then(() =>
//     console.log('Connection has been established successfully.'))
//   .catch((error) =>
//     console.error('Unable to connect to the database:', error));


export default dbConnection ;
