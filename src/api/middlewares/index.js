import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import userAuthentication from './auth/userAuthentication.js';
import speedLimiter from './speedLimiter.js';

/**
 * @type {express.Handler]}
 */
const globalMiddlewares = [helmet(), morgan('combined'), cors(), express.json(), cookieParser()];

/**
 * @type {{ routes: { name: String, methods: [('any'|'get'|'post'|'update'|'delete')], controllers: [String] }[], middlewares: [express.Handler] }[]}
 */
const routesMiddlewares = [
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
];

export default { globalMiddlewares, routesMiddlewares };
