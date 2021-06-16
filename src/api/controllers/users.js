import EventService from '../../services/EventService.js';

const get_auth = async (req, res, next) => {
	EventService.emit('signup', { data: { username: 'moshe', email: 'moshe@gmail.com' } });
	return { test: true };
};

const get_test = async (req, res, next) => {
	return { test: true };
};

const post_auth = async (req, res, next) => {
	console.log('something');
	return { test: true };
};

export default {
	get_auth,
	get_test,
	post_auth,
};
