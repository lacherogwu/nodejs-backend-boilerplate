import axios from 'axios';

const get_something = async (req, res, next) => {
	const response = await axios.post('https://endey.proxy.beeceptor.com/something');
	// console.log(response);
	return { hello: 'test' };
};
export default { get: () => {}, get_something };
