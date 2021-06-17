import mongoose from 'mongoose';

class BaseSchema extends mongoose.Schema {
	constructor(definition) {
		super(definition, { timestamps: true });
	}
}

export default BaseSchema;
