import mongoose from 'mongoose';

export default async dbURI => {
	const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };
	await mongoose.connect(dbURI, options);
	console.log('connected to database successfully!');
};
