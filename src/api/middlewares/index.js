import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import userAuthentication from './auth/userAuthentication.js';
import speedLimiter from './speedLimiter.js';
import FrameworkService from '../../services/FrameworkService.js';

const globalMiddlewares = FrameworkService.buildGlobalMiddlewares([helmet(), morgan('combined'), cors(), express.json(), cookieParser(), speedLimiter]);

const routesMiddlewares = FrameworkService.buildRoutesMiddlewares([
	{
		routes: [
			{
				name: 'users',
				methods: ['get'],
				controllers: ['authenticate'],
			},
		],
		middlewares: [userAuthentication],
	},
	{
		routes: [
			{
				name: 'monsters',
				methods: ['any'],
				controllers: ['*'],
			},
			{
				name: 'items',
				methods: ['post'],
				controllers: ['getSomething'],
			},
		],
		middlewares: [
			(req, res, next) => {
				console.log('test');
			},
		],
	},
]);

export default { globalMiddlewares, routesMiddlewares };
