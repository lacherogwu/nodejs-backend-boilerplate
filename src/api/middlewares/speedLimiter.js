import slowDown from 'express-slow-down';

const speedLimiter = slowDown({
	windowMs: 60 * 1000,
	delayAfter: 100,
	delayMs: 5000,
});

export default speedLimiter;
