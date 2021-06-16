import { DbService } from '../index.js';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import AppError from '../../utils/AppError.js';
import argon2 from 'argon2';

class AuthService {
	constructor() {
		this.maxAge = 60 * 60 * 24 * 28;
	}

	async signup(email, password) {
		const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
		const user = await DbService.create('User', { email, password: hashedPassword });
		const token = this.createToken(user._id);
		const cookie = this.createCookie('jwt', token);

		return { user, cookie };
	}

	async login(email, password) {
		const user = await DbService.findOne('User', { email });

		// match password
		const passwordMatch = await argon2.verify(user.password, password);
		if (!user || !passwordMatch) throw new AppError('Email address or password is incorrect', 401);

		const token = this.createToken(user._id);
		const cookie = this.createCookie('jwt', token);

		return { user, cookie };
	}

	async authenticate(token) {
		if (!token) throw new AppError('Authentication failed', 401);

		// verify token
		const decodedToken = jwt.verify(token, config.jwtSecret);

		const user = await DbService.findById('User', decodedToken.id);
		if (!user) throw new AppError('Authentication failed', 401);

		return user;
	}

	createToken(id) {
		return jwt.sign({ id }, config.jwtSecret, {
			expiresIn: this.maxAge,
		});
	}

	createCookie(name, data) {
		return [
			name,
			data,
			{
				httpOnly: true,
				secure: config.env === 'development' ? false : true,
				maxAge: this.maxAge * 1000,
			},
		];
	}
}

export default new AuthService();
