const get_monsterName = async (req, res, next) => {
	return { test: true };
};

const post_monsterName = async (req, res, next) => {
	return { test: true };
};

const put_monsterName = async (req, res, next) => {
	res.statusCode = 201;
	return { message: 'added monster successfully' };
};

export default {
	get_monsterName,
	post_monsterName,
	put_monsterName,
};
