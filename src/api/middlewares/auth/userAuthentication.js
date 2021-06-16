import { AuthService } from '../../../services/index.js';

const userAuthenticationMiddleware = async (req, res, next) => {
	const { jwt: token } = req.cookies;
	const user = await AuthService.authenticate(token);
	res.locals.user = user;

	next();
};

export default userAuthenticationMiddleware;
