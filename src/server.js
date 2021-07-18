import config from './config/index.js';
import './app.js';
import db from './db.js';
import HttpService from './services/HttpService.js';

const { port, dbURI } = config;

// await db(dbURI);
const server = HttpService.initApp(port);

// handle unhandled rejection
process.on('unhandledRejection', err => {
	console.error(err.name, err.message);
	console.log('UNHANDLED REJECTION 💥 Shutting down...');
	process.exit(1);
});
