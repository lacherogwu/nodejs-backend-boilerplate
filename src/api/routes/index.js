// import { Router } from 'express';
import glob from 'glob';
import Aigle from 'aigle';
// import controllerWrapper from '../../utils/controllerWrapper.js';
// import middlewareWrapper from '../../utils/middlewareWrapper.js';
import _ from 'lodash';
// import middlewares from '../middlewares/index.js';

const buildRoutes = async () => {
	const files = glob.sync('./src/api/controllers/*.js', { realpath: true });

	const routes = await Aigle.transform(files, async (acc, value) => {
		const [name] = value.split('/').pop().split('.');
		const { default: d } = await import(value);
		acc[name] = _.map(d, (handler, key) => {
			const [method, name = ''] = key.split('_');
			return { method, name, handler };
		});
	});

	return routes;
};

// const routes = {
// 	monsters: {
// 		get_monsterName: function () {},
// 	},
// };

// const matchString = (search, value) => value === search || value === '*';

// const getMiddlewares = controller => {
// 	const middlewaresArray = _(middlewares)
// 		.filter(item => _.some(item.controllers, mdController => _.every(['moduleName', 'method', 'name'], item => matchString(controller[item], mdController[item]))))
// 		.flatMap(i => i.middlewares)
// 		.map(item => middlewareWrapper(item))
// 		.value();

// 	return [...new Set(middlewaresArray)];
// };

// const buildRoutes = async () => {
// 	const modules = await getControllers();

// 	const routes = _.transform(modules, (acc, controllers, moduleName) => {
// 		acc[moduleName] = [];
// 		_.each(controllers, handler => {
// 			const [method, name = ''] = handler.name.split('_');

// 			// const controllerMiddlewares = getMiddlewares({ moduleName, method, name });
// 			acc[moduleName].push({ method, name, handler });
// 		});
// 	});

// 	return routes;
// };

// const useRoutes = async () => {
// 	const routes = await buildRoutes();
// 	_.each(routes, (controllers, route) => _.each(controllers, ({ method, name, middlewares, handler }) => router[method](`/${route}/${name}`, ...middlewares, controllerWrapper(handler))));
// };

// await useRoutes();

const routes = await buildRoutes();
export default routes;
