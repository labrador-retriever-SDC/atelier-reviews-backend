import fs from 'node:fs';
import path from 'node:path';
import dbConnection from './index'
import { Review } from './models'

const db = dbConnection();

/**
 * Seeding data by executing seed.sql
 */
const migrateData = () => {
  db.sync()
  .then(() => Review.count())
  .then((count) => {
    // seed data only if Reviews is empty
    if (count === 0) {
      console.log('Loading data...', new Date())
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
  .finally(() => console.log("Done seeding data.", new Date()))
}

export default migrateData;