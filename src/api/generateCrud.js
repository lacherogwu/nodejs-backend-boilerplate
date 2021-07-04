/**
 * @param {import('../shared/Crud.js').default} Service
 */
const generateCrud = Service => {
	const get_find = async (req, res, next) => {
		const { findOne, filter, fields, sort } = req.query;

		return await Service.find(findOne, filter, fields, sort);
	};

	const post_create = async (req, res, next) => {
		return await Service.create(req.body);
	};

	const put_update = async (req, res, next) => {
		const { id } = req.body;

		return await Service.update(id, req.body);
	};

	const delete_delete = async (req, res, next) => {
		const { id } = req.body;

		return await Service.delete(id);
	};

	return { get_find, post_create, put_update, delete_delete };
};

export default generateCrud;
