import { EventService, AuthService } from '../../services/index.js';

const get_auth = async (req, res, next) => {
	EventService.emit('signup', { data: { username: 'moshe', email: 'moshe@gmail.com' } });
	return { test: true };
};

const post_signup = async (req, res, next) => {
	const { email, password } = req.body;

	const { user, cookie } = await AuthService.signup(email, password);
	res.cookie(...cookie);

	return user;
};

const post_login = async (req, res, next) => {
	const { email, password } = req.body;

	const { user, cookie } = await AuthService.login(email, password);
	res.cookie(...cookie);

	return user;
};

const get_authenticate = async (req, res, next) => res.locals.user;

const get_logout = async (req, res, next) => {
	res.cookie('jwt', '', { maxAge: 1 });
};

export default {
	get_auth,
	post_signup,
	post_login,
	get_authenticate,
	get_logout,
};
