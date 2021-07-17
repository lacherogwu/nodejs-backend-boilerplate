import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import userAuthentication from './auth/userAuthentication.js';
import speedLimiter from './speedLimiter.js';
import HttpService from '../../services/HttpService.js';

// prettier-ignore
HttpService
	.buildGlobalMiddlewares([
		helmet(),
		morgan('combined'),
		cors(),
		express.json(),
		cookieParser(),
		speedLimiter
	])
	.buildRoutesMiddlewares([
	{
		routes: [
			{
				paths: ['users'],
				methods: ['post'],
				controllers: ['authenticate', 'logout', 'login'],
			},
		],
		middlewares: [userAuthentication],
	},
	{
		routes: [
			{
				paths: ['users'],
				methods: ['*'],
				controllers: ['*'],
			},
			// {
			// 	paths: ['items'],
			// 	methods: ['post'],
			// 	controllers: ['getSomething'],
			// },
		],
		middlewares: [
			(req, res, next) => {
				console.log('test');
			},
		],
	},
]);
