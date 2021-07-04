import mongoose from 'mongoose';
import { BaseSchema } from '../shared/index.js';
import validation from '../utils/validations.js';

const Schema = new BaseSchema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validation.email, 'Please enter a valid email'],
		index: true,
	},
	password: {
		type: String,
		required: true,
		minlength: [6, 'Minimum password length is 6 characters'],
	},
});

// method to remove pw from user object
Schema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	return obj;
};

const Model = mongoose.model('user', Schema);

export default Model;
