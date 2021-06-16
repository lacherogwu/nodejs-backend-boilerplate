import 'dotenv/config';

export default {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	dbURI: process.env.DB_URI,
	jwtSecret: process.env.JWT_SECRET,
};
