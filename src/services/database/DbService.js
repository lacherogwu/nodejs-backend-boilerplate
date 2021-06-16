import Models from '../../models/index.js';

class DbService {
	create(collection, doc) {
		return Models[collection].create(doc);
	}

	findOne(collection, doc) {
		return Models[collection].findOne(doc);
	}

	findById(collection, id) {
		return Models[collection].findById(id);
	}
}

export default new DbService();
