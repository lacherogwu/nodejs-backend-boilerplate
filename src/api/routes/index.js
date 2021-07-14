// import { Router } from 'express';
import glob from 'glob';
import Aigle from 'aigle';
import _ from 'lodash';

const buildRoutes = async () => {
	const files = glob.sync('./src/api/controllers/*.js', { realpath: true });

	const routes = await Aigle.transform(
		files,
		async (acc, value) => {
			const [name] = value.split('/').pop().split('.');
			const { default: d } = await import(value);
			acc[name] = _.map(d, (handler, key) => {
				const [method, name = ''] = key.split('_');
				return { method, name, handler };
			});
		},
		{}
	);

	return routes;
};

export default await buildRoutes();
