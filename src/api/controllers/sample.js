import { SampleService } from '../../services/index.js';
import generateCrud from '../generateCrud.js';

const { get_find, post_create, put_update, delete_delete } = generateCrud(SampleService);

export default {
	get_find,
	post_create,
	put_update,
	delete_delete,
};
