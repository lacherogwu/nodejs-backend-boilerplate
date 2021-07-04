import mongoose from 'mongoose';
import { BaseSchema } from '../shared/index.js';

const Schema = new BaseSchema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const Model = mongoose.model('sample', Schema);

export default Model;
