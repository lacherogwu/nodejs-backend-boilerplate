import mongoose from 'mongoose';

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
	find() {
		return this.#model.find();
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
