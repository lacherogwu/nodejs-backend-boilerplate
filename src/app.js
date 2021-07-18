// import './subscribers/email.js';
import { HttpService } from './services/index.js';
import './api/middlewares/index.js';
import './api/errorHandler.js';
import _ from 'lodash';

await HttpService.buildRoutes('./src/api/controllers/*.js');
const settings = {
	'trust proxy': true,
};
HttpService.setSettings(settings).useApi();
