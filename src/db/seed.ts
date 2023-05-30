import fs from 'node:fs';
import path from 'node:path';
// import dbConnection from './index'
// import getModels from '../models/models'

// const db = dbConnection();

/**
 * Seeding data by executing seed.sql
 */
const seedData = (db) => {
  console.time("Database synced");

  db.sync()
  .then(() => db.query(`
  select id from reviews limit 1;
  `))
  .then((result) => {
    // Check if any rows exist
    const anyReview = result[0].length > 0;

    // seed data only if Reviews is empty
    if (!anyReview) {
      console.log('Loading data...',)
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
  .catch(err => {
    console.log("Error seeding data", err)
    throw err;
  })
  .finally(() => console.timeLog("Database synced"))
}

export default seedData;