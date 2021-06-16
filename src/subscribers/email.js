import EventService from '../services/EventService.js';

EventService.on('signup', async ({ data }) => {
	// send email
	console.log('sending an email', data);
});
