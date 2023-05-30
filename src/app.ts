import createServer from './server';
import seedData from './db/seed';
import dbConnection from './db/index'

const db = dbConnection();
const app = createServer(db);

const PORT = process.env.PORT || 3000;

try {
  seedData(db);
  app.listen(PORT, () => {console.log(`Now running on http://localhost:${PORT}`)})
} catch (error) {
  console.log('Error ocurred')
}

export default app;