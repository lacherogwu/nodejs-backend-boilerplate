import { Crud } from '../shared/index.js';
import { Sample } from '../models/index.js';
class SampleService extends Crud {
	constructor() {
		super(Sample);
	}
}

export default new SampleService();
