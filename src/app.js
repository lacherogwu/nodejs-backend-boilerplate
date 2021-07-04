import express from 'express';
import api from './api/index.js';
import _ from 'lodash';
import { AppError } from './shared/index.js';
import errorHandler from './api/errorHandler.js';
import './subscribers/email.js';

const app = express();

// app behind proxy (nginx)
app.set('trust proxy', true);

// _.each(api, router => app.use(router));

// 404 error handler
app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));

app.use(errorHandler); // Global Error Handling Middleware

export default app;
