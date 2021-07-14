import api from './api/index.js';
import _ from 'lodash';
import { AppError } from './shared/index.js';
import errorHandler from './api/errorHandler.js';
import './subscribers/email.js';
import FrameworkService from './services/FrameworkService.js';

// FrameworkService.setSettings().useRoutesAndMiddlewares().useErrorHandlers();
FrameworkService.setSettings().useApi(api).useErrorHandlers();

// _.each(api, router => app.use(router));

// 404 error handler
// app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));

// app.use(errorHandler); // Global Error Handling Middleware

export default FrameworkService.app;
