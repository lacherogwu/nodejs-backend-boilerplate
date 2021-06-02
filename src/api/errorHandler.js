import AppError from '../utils/AppError.js';
import config from '../config/index.js';

const axiosError = err => {
	const status = err.response ? err.response.status : 500;
	const message = !err.message.startsWith('Request') ? err.message : undefined;
	const data = err.response ? err.response.data : undefined;

	return new AppError(message, status, data);
};

const dbErrors = {
	castError: err => new AppError(`Invalid ${err.path}: ${err.value}`, 400),
	noUser: err => new AppError(err.message, 404),
	validation: err => {
		const message = Object.values(err.errors)
			.map(i => i.message)
			.join(', ');
		return new AppError(`Invalid input data. ${message}`, 400);
	},
	duplicate: err => {
		const entries = Object.entries(err.keyValue);
		return new AppError(`Duplicated key. ${entries[0][0]}: ${entries[0][1]}`, 400);
	},
};

const prodError = (err, res) => {
	console.error('ERROR 💥', err);

	if (!err.isOperational) {
		err.statusCode = 500;
		err.message = 'Something went wrong!';
	}

	const { statusCode, message, data } = err;

	res.status(statusCode).json({
		success: false,
		message,
		data,
	});
};

const devError = (err, res) => {
	console.error('ERROR 💥', err);

	const { statusCode, message, data } = err;
	res.status(statusCode || 500).json({
		success: false,
		message,
		data,
		error: err,
		stack: err.stack,
	});
};

const response = config.env === 'development' ? devError : prodError;

export default (err, req, res, next) => {
	// error types handler
	if (err.isAxiosError) err = axiosError(err);
	else if (err.name === 'CastError') err = dbErrors.castError(err);
	else if (err.message === 'User does not exists') err = dbErrors.noUser(err);
	else if (err.name === 'ValidationError') err = dbErrors.validation(err);
	else if (err.code === 11000) err = dbErrors.duplicate(err);

	return response(err, res);
};
