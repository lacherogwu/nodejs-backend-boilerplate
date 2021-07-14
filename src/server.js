import config from './config/index.js';
import app from './app.js';
import db from './db.js';
import FrameworkService from './services/FrameworkService.js';

const { port, dbURI } = config;

// await db(dbURI);
const server = FrameworkService.initApp(port);

// handle unhandled rejection
process.on('unhandledRejection', err => {
	console.error(err.name, err.message);
	console.log('UNHANDLED REJECTION 💥 Shutting down...');
	process.exit(1);
});
