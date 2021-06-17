import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import userAuthentication from './auth/userAuthentication.js';
import speedLimiter from './speedLimiter.js';

const middlewares = [
	{
		controllers: [{ moduleName: '*', method: '*', name: '*' }],
		middlewares: [helmet(), morgan('combined'), cors(), express.json(), cookieParser(), speedLimiter],
	},
	{
		controllers: [{ moduleName: 'users', method: 'get', name: 'authenticate' }],
		middlewares: [userAuthentication],
	},
];

export default middlewares;
