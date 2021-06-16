import EventEmitter from 'eventemitter3';

class EventService extends EventEmitter {
	constructor() {
		super();
	}
}

export default new EventService();
