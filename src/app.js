// import './subscribers/email.js';
import { HttpService } from './services/index.js';
import './api/middlewares/index.js';
import './api/errorHandler.js';
import { AppError } from './shared/index.js';

await HttpService.buildRoutes('./src/api/controllers/*.js');
const settings = {
	'trust proxy': true,
};
HttpService.setSettings(settings).useApi().use404ErrorHandler().useGlobalErrorHandlers();

HttpService.useGlobalErrorHandlers([
	{
		identifier: 'isAxiosError',
		value: true,
		mode: 'EQ',
		handler: err => {
			const status = err.response ? err.response.status : 500;
			const message = !err.message.startsWith('Request') ? err.message : undefined;
			const data = err.response ? err.response.data : undefined;

			return new AppError(message, status, data);
		},
	},
	{
		identifier: 'name',
		value: 'CastError',
		mode: 'EQ',
		handler: err => new AppError(`Invalid ${err.path}: ${err.value}`, 400),
	},
	{
		identifier: 'message',
		value: 'User does not exists',
		mode: 'EQ',
		handler: err => new AppError(err.message, 404),
	},
	{
		identifier: 'name',
		value: 'ValidationError',
		mode: 'EQ',
		handler: err => {
			const message = Object.values(err.errors)
				.map(i => i.message)
				.join(', ');
			return new AppError(`Invalid input data. ${message}`, 400);
		},
	},
	{
		identifier: 'code',
		value: 11000,
		mode: 'EQ',
		handler: err => {
			const entries = Object.entries(err.keyValue);
			return new AppError(`Duplicated key. ${entries[0][0]}: ${entries[0][1]}`, 400);
		},
	},
]);
