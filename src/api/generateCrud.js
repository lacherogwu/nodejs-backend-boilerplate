/**
 * @param {import('../shared/Crud.js').default} Service
 */
const generateCrud = Service => {
	const get_find = async (req, res, next) => {
		const data = await Service.find();
		return data;
	};

	const post_create = async (req, res, next) => {
		const data = await Service.create(req.body);
		return data;
	};

	const put_update = async (req, res, next) => {
		const { id } = req.body;

		const data = await Service.update(id, req.body);
		return { data };
	};

	const delete_delete = async (req, res, next) => {
		const { id } = req.body;

		const data = await Service.delete(id);
		return data;
	};

	return { get_find, post_create, put_update, delete_delete };
};

export default generateCrud;
