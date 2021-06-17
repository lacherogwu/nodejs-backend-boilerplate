const get_something = (req, res, next) => {
	return { noder: true };
};

const post_something = (req, res, next) => {
	const { uid } = req.body;
	return { noder: true, uid };
};

export default { get_something, post_something };
