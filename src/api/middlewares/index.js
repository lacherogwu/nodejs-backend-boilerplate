import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import userAuthentication from './auth/userAuthentication.js';

const middlewares = [
	{
		controllers: [{ moduleName: '*', method: '*', name: '*' }],
		middlewares: [helmet(), morgan('combined'), cors(), express.json(), cookieParser()],
	},
	{
		controllers: [{ moduleName: 'users', method: 'get', name: 'authenticate' }],
		middlewares: [userAuthentication],
	},
];

export default middlewares;
