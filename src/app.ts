import createServer from './server';
import migrateData from './db/seed';

const app = createServer();

const PORT = process.env.PORT || 3000;

try {
  migrateData();
  app.listen(PORT, () => {console.log(`Now running on http://localhost:${PORT}`)})
} catch (error) {
  console.log('Error ocurred')
}

export default app;