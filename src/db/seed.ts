import fs from 'node:fs';
import path from 'node:path';
import dbConnection from './index'
import { Review } from '../models/models'

const db = dbConnection();

/**
 * Seeding data by executing seed.sql
 */
const migrateData = () => {
  console.time("Database synced");

  db.sync()
  .then(() => Review.findOne())
  .then((anyReview) => {
    // seed data only if Reviews is empty
    if (anyReview === null) {
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
  .catch(err => console.log("Error seeding data", err))
  .finally(() => console.timeLog("Database synced"))
}

export default migrateData;