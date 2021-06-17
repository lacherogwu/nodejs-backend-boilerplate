import mongoose from 'mongoose';

class DbService {
	/**
	 *
	 * @param {mongoose.Model} Model
	 * @param {*} doc
	 * @returns {Promise}
	 */
	create(Model, doc) {
		return Model.create(doc);
	}

	/**
	 *
	 * @param {mongoose.Model} Model
	 * @param {mongoose.FilterQuery} filter
	 * @param {*} projection
	 * @param {mongoose.QueryOptions} options
	 * @returns {Promise}
	 */
	findOne(Model, filter, projection, options) {
		return Model.findOne(filter, projection, options);
	}

	/**
	 *
	 * @param {mongoose.Model} Model
	 * @param {*} id
	 * @param {*} projection
	 * @param {mongoose.MongooseQueryOptions} options
	 * @returns {Promise}
	 */
	findById(Model, id, projection, options) {
		return Model.findById(id, projection, options);
	}
}

// await new DbService().findById(Model, id, test)
export default new DbService();
