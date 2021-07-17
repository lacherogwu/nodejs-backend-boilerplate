import express from 'express';
import glob from 'glob';
import Aigle from 'aigle';
import _ from 'lodash';

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

	constructor() {
		this.app = express();
	}

	setSettings() {
		// app behind proxy (nginx)
		this.app.set('trust proxy', true);

		return this;
	}

	useErrorHandlers() {
		return this;
	}

	#useGlobalMiddlewares() {
		_.each(this.#globalMiddlewares, middleware => this.app.use(middleware));
	}

	#useRoutesAndMiddlewares() {
		console.log('using routes and middlewares');

		_.each(this.#routes, route => {
			const middlewares = _.map(route.middlewares, middleware => this.#middlewareWrapper(middleware));
			this.app[route.method](`/${route.path}/${route.name}`, ...middlewares, this.#controllerWrapper(route.handler));
		});
	}

	useApi() {
		this.#useGlobalMiddlewares();
		this.#useRoutesAndMiddlewares();

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
	 * @param {{ routes: { path: String, methods: [('*'|'get'|'post'|'update'|'delete')], controllers: [String] }[], middlewares: [express.Handler] }[]} middlewares - Build Routes Middlewares
	 * @returns HttpService
	 */
	buildRoutesMiddlewares(middlewares) {
		this.#routesMiddlewares = middlewares;
		return this;
	}

	#includesOrAny(array, string) {
		return _.includes(array, string) || _.includes(array, '*');
	}
	#middlewareEligible(middlewareObject, controller) {
		console.log('middlewareObject', middlewareObject);
		console.log('controller', controller);
	}

	/**
	 *
	 * @param {{ path: string, method: string, name: string}} controller
	 */
	#findMiddlewares(controller) {
		const middlewares = _.transform(
			this.#routesMiddlewares,
			(acc, routesMiddlewaresObject) => {
				const isEligible = _.every(routesMiddlewaresObject.routes, route => this.#includesOrAny(route.paths, controller.path) && this.#includesOrAny(route.methods, controller.method) && this.#includesOrAny(route.controllers, controller.name));
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
	 * @returns HttpService
	 */
	async buildRoutes(controllersPath) {
		const files = glob.sync(controllersPath, { realpath: true });

		const routes = await Aigle.transform(
			files,
			async (acc, realPath) => {
				const [path] = _(realPath).split('/').pop().split('.');
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
		return this;
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

	initApp(port) {
		return this.app.listen(port, () => console.log(`listening at http://localhost:${port}`));
	}
}

export default new HttpService();
