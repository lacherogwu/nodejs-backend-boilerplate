import mongoose from 'mongoose';
import { getQuery } from '../utils/mongoose.js';

class Crud {
	#model;
	/**
	 *
	 * @param {mongoose.Model} Model
	 */
	constructor(Model) {
		this.#model = Model;
	}

	/**
	 *
	 * @returns {Promise}
	 */
	find(isFindOne, filter = {}, fields, sort) {
		let query;

		if (!isFindOne) {
			query = this.#model.find(filter);
			if (sort) query.sort(getQuery(sort));
		} else {
			query = this.#model.findOne(filter);
		}

		if (fields) {
			query.select(getQuery(fields));
		}

		return query;
	}

	/**
	 *
	 * @param {*} doc
	 * @returns {Promise}
	 */
	create(doc) {
		return this.#model.create(doc);
	}

	/**
	 *
	 * @param {mongoose.ObjectId} id
	 * @param {*} doc
	 * @returns {Promise}
	 */
	update(id, doc) {
		return this.#model.findByIdAndUpdate(id, doc, {
			new: true,
			runValidators: true,
		});
	}

	/**
	 *
	 * @param {mogoose.ObjectId} id
	 * @returns {Promise}
	 */
	delete(id) {
		return this.#model.findByIdAndDelete(id);
	}
}

export default Crud;
