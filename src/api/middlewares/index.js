import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import express from 'express';

const middlewares = [
	{
		controllers: [{ moduleName: '*', method: '*', name: '*' }],
		middlewares: [helmet(), morgan('combined'), cors(), express.json()],
	},
];

export default middlewares;
