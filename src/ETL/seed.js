const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbDefault = process.env.DB_NAME_DEFAULT || '';

let dbUser = '';
let dbPass = '';
let dbHost = '';
let dbPort = 5432;
let dbName = '';

switch (process.env.NODE_ENV) {
  case "test":
    dbUser = process.env.DB_USER_TEST;
    dbPass = process.env.DB_PASS_TEST;
    dbHost = process.env.DB_HOST_TEST;
    dbPort = process.env.DB_PORT_TEST;
    dbName = process.env.DB_NAME_TEST;
    break;
  case "prod":
    dbUser = process.env.DB_USER_PROD;
    dbPass = process.env.DB_PASS_PROD;
    dbHost = process.env.DB_HOST_PROD;
    dbPort = process.env.DB_PORT_PROD;
    dbName = process.env.DB_NAME_PROD;
    break;
  default:
    dbUser = process.env.DB_USER;
    dbPass = process.env.DB_PASS;
    dbHost = process.env.DB_HOST;
    dbPort = process.env.DB_PORT;
    dbName = process.env.DB_NAME;
}

const createDatabaseIfNotExists = async (database) => {
  /**
 * Connecting to the default database
 */
  const client = new Client({
    database: dbDefault,
    host: dbHost,
    user: dbUser,
    password: dbPass,
    port: Number(dbPort)
  });

  try {
    await client.connect();

    const dbExistsQuery = `SELECT datname FROM pg_database WHERE datname = '${database}'`;
    const dbExistsResult = await client.query(dbExistsQuery);
    const databaseExists = dbExistsResult.rowCount > 0;

    if (!databaseExists) {
      const createDatabaseQuery = `CREATE DATABASE ${database}`;
      await client.query(createDatabaseQuery);
      console.log(`Database (${database}) created successfully!`)
    } else {
      console.log(`Database (${database}) already exists, resetting database...`);
    }
  } catch (error) {
    console.log('Error creating database', error);
  } finally {
    client.end();
  }

}

const loadData = async (client) => {
  console.time("Database seeded");

  try {
    const loadDataQuery = fs.readFileSync(path.join(__dirname, '/seed.sql'), 'utf8');
    await client.query(loadDataQuery);

    const tables = ['reviews', 'photos', 'characteristics', 'characteristics_reviews'];
    const updatePrimaryKeys = tables.map(table => {
      const updateIdQuery = `select setval('${table}_id_seq', (select max(id) from ${table}), true);`;
      return client.query(updateIdQuery);
    })
    await Promise.all(updatePrimaryKeys);
  } catch (error) {
    console.log(`Error loading data`, error);
  } finally {
    console.timeLog("Database seeded")
    client.end();
  }

}

const initializeDatabase = async (database) => {
  const client = new Client({
    database: dbName,
    host: dbHost,
    user: dbUser,
    password: dbPass,
    port: Number(dbPort)
  });

  try {
    await client.connect();
    const createTablesQuery = fs.readFileSync(path.join(__dirname, '/schema.sql'), 'utf8');
    await client.query(createTablesQuery);
    console.log(`Database (${database}) initialized, loading data...`)
  } catch (error) {
    console.log(`Error initializing database (${database})`, error)
  } finally {
    loadData(client);
  }

}

const run = async () => {
  await createDatabaseIfNotExists(dbName);
  await initializeDatabase(dbName);
}
run();

