import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.get('/', async(req: Request, res: Response): Promise<Response> => res.status(200).send({ message: 'Welcome to SDC'}));

const PORT = process.env.PORT || 4000;

try {
  app.listen(3000, () => {console.log(`Server running on http://localhost:${PORT}`)})
} catch (error) {
  console.log('Error ocurred')
}