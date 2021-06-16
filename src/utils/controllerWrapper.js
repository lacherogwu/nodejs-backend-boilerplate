export default fn => async (req, res, next) => {
	try {
		const data = await fn(req, res, next);
		res.status(res.statusCode || 200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
};
