import _ from 'lodash';
import { AppError } from './shared/index.js';
import errorHandler from './api/errorHandler.js';
import './subscribers/email.js';
import HttpService from './services/HttpService.js';
import './api/middlewares/index.js';

await HttpService.buildRoutes('./src/api/controllers/*.js');
HttpService.setSettings().useApi().useErrorHandlers();

// _.each(api, router => app.use(router));

// 404 error handler
// app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));

// app.use(errorHandler); // Global Error Handling Middleware

export default HttpService.app;
