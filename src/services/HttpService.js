import express from 'express';
import glob from 'glob';
import Aigle from 'aigle';
import _ from 'lodash';
import { AppError } from '../shared/index.js';

class HttpService {
	/**
	 * @type {[express.Handler]}
	 */
	#globalMiddlewares;

	/**
	 * @type {[{
	 * 	routes: [
	 * 		{
	 * 			paths: [string],
	 * 			methods: [('get'|'post'|'put'|'delete')],
	 * 			controllers: [string]
	 * 		}
	 * 	],
	 * 	middlewares: [express.Handler]
	 * }]}
	 */
	#routesMiddlewares;

	/**
	 * @type {[{ path: string, method: string, name: string, middlewares:[express.Handler], handler: express.Handler }]}
	 */
	#routes;

	/**
	 * @type {[{
	 * 	identifier: string,
	 * 	value: *,
	 * 	mode: ('EQ'|'IN'),
	 * 	handler: (err: Error) => { statusCode: number, message: string, data: {} }
	 * }]}
	 */
	#errorHandlers;

	constructor() {
		this.app = express();
	}

	/**
	 *
	 * @param {{ [key: string]: string }} settings
	 * @returns
	 */
	setSettings(settings) {
		_.each(settings, (value, key) => this.app.set(key, value));
		return this;
	}

	/**
	 *
	 * @param {[{
	 * 	identifier: string,
	 * 	value: *,
	 * 	mode: ('EQ'|'IN'),
	 * 	handler: (err: Error) => { statusCode: number, message: string, data: {} }
	 * }]} errorHandlers
	 */

	#useGlobalMiddlewares() {
		_.each(this.#globalMiddlewares, middleware => this.app.use(middleware));
	}

	#useRoutesAndMiddlewares() {
		_.each(this.#routes, route => {
			const wrappedMiddlewares = _.map(route.middlewares, middleware => this.#middlewareWrapper(middleware));
			this.app[route.method](`/${route.path}/${route.name}`, ...wrappedMiddlewares, this.#controllerWrapper(route.handler));
		});
	}

	/**
	 *
	 * @returns HttpService
	 */
	#use404ErrorHandler() {
		this.app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));
		return this;
	}

	#useGlobalErrorHandlers() {
		this.app.use(
			this.#errorHandlerWrapper((err, req, res, next) => {
				const errorHandler = _.find(this.#errorHandlers, errorHandlerObject => {
					const modes = {
						EQ: (a, b) => a === b,
						IN: (a, b) => _.includes(a, b),
					};
					return modes[errorHandlerObject.mode || 'EQ'](err[errorHandlerObject.identifier], errorHandlerObject.value);
				});

				return errorHandler?.handler(err) || (err.isOperational ? err : {});
			})
		);
	}

	useApi() {
		this.#useGlobalMiddlewares();
		this.#useRoutesAndMiddlewares();
		this.#use404ErrorHandler();
		this.#useGlobalErrorHandlers();

		return this;
	}

	/**
	 * @param {[express.Handler]} middlewares - Build Global Middlewares
	 * @returns HttpService
	 */
	buildGlobalMiddlewares(middlewares) {
		this.#globalMiddlewares = middlewares;
		return this;
	}

	/**
	 * @param {[{
	 * 		routes: [{
	 * 			paths: [string],
	 * 			methods: [('*'|'get'|'post'|'update'|'delete')],
	 * 			controllers: [string]
	 * 		}],
	 * 		middlewares: [express.Handler]
	 * 	}]} middlewares - Build Routes Middlewares
	 * @returns HttpService
	 */
	buildRoutesMiddlewares(middlewares) {
		this.#routesMiddlewares = middlewares;
		return this;
	}

	/**
	 *
	 * @param {[{
	 * 	identifier: string,
	 * 	value: *,
	 * 	mode: ('EQ'|'IN'),
	 * 	handler: (err: Error) => { statusCode: number, message: string, data: {} }
	 * }]} errorHandlers
	 */
	buildGlobalErrorHandlers(errorHandlers) {
		this.#errorHandlers = errorHandlers;
		return this;
	}

	#includesOrAny(array, string) {
		return _.includes(array, string) || _.includes(array, '*');
	}

	/**
	 *
	 * @param {{ path: string, method: string, name: string}} controller
	 */
	#findMiddlewares(controller) {
		const middlewares = _.transform(
			this.#routesMiddlewares,
			(acc, routesMiddlewaresObject) => {
				const isEligible = _.some(routesMiddlewaresObject.routes, route => this.#includesOrAny(route.paths, controller.path) && this.#includesOrAny(route.methods, controller.method) && this.#includesOrAny(route.controllers, controller.name));
				if (!isEligible) return;

				acc.push(...routesMiddlewaresObject.middlewares);
			},
			[]
		);
		return middlewares;
	}

	/**
	 *
	 * @param {string} controllersPath
	 * @param {number} pathSplitIndex - Where to get the path name from the realPath
	 */
	async buildRoutes(controllersPath, pathSplitIndex = 0) {
		const files = glob.sync(controllersPath, { realpath: true });

		const routes = await Aigle.transform(
			files,
			async (acc, realPath) => {
				const [path] = _(realPath)
					.split('/')
					.findLast((item, index, list) => {
						const listLength = list.length - 1;
						if (index === listLength - pathSplitIndex) return true;
					})
					.split('.');
				const { default: controllers } = await import(realPath);
				const routes = _.map(controllers, (handler, key) => {
					const [method, name = ''] = _.split(key, '_');

					const middlewares = this.#findMiddlewares({ path, method, name });
					return { path, method, name, middlewares, handler };
				});
				acc.push(...routes);
			},
			[]
		);
		this.#routes = routes;
		return routes;
	}

	#controllerWrapper(fn) {
		return async (req, res, next) => {
			try {
				const data = await fn(req, res, next);
				res.status(res.statusCode || 200).json({ success: true, data });
			} catch (err) {
				next(err);
			}
		};
	}

	#middlewareWrapper(fn) {
		return (req, res, next) => fn(req, res, next)?.catch(next);
	}

	#errorHandlerWrapper(fn) {
		return (err, req, res, next) => {
			console.error('ERROR 💥', err);
			let { statusCode, message, data } = fn(err, req, res, next);

			const devInformation = {};
			if (process.env.NODE_ENV === 'development') {
				devInformation.error = err;
				devInformation.stack = err.stack;
			} else {
				if (!err.isOperational) {
					statusCode = 500;
					message = 'Something went wrong!';
				}
			}

			return res.status(statusCode || 500).json({ success: false, message, data, ...devInformation });
		};
	}

	initApp(port) {
		return this.app.listen(port, () => console.log(`listening at http://localhost:${port}`));
	}
}

export default new HttpService();
