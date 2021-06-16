import { EventService } from '../services/index.js';

EventService.on('signup', async ({ data }) => {
	// send email
	console.log('sending an email', data);
});
