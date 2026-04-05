import express, { Application } from 'express';
import cors from 'cors';
import { initialize } from './_helpers/db';
import { errorHandler } from './_middleware/errorHandler';
import usersController from './users/users.controller';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersController);
app.use(errorHandler);

initialize()
  .then(() => {
    app.listen(4000, () => {
      console.log('✅ Server running on http://localhost:4000');
    });
  })
  .catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });