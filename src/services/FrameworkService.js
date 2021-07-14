import express from 'express';
import _ from 'lodash';

class FrameworkService {
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

	/**
	 *
	 * @param {[express.Handler]} globalMiddlewares
	 */
	#useGlobalMiddlewares(globalMiddlewares) {
		_.each(globalMiddlewares, middleware => this.app.use(middleware));
	}

	/**
	 *
	 * @param {{ routes: { [controller: string]: { method: ('get'|'post'|'update'|'delete'), name: string, handler: express.Handler }[] }[], middlewares: { globalMiddlewares: [express.Handler], routesMiddlewares: { routes: { name: String, methods: [('any'|'get'|'post'|'update'|'delete')], controllers: [String] }[], middlewares: [express.Handler] }[] }}} api - Api object
	 * @returns
	 */
	useApi(api) {
		this.#useGlobalMiddlewares(api.middlewares.globalMiddlewares);

		// TODO: need to combine middlewares with routes
		_.each(api.routes, (route, path) => {
			_.each(route, controller => {
				this.app[controller.method](`/${path}/${controller.name}`, this.#controllerWrapper(controller.handler));
			});
		});

		return this;
	}

	/**
	 * @param {[express.Handler]} middlewares - Build Global Middlewares
	 */
	buildGlobalMiddlewares(middlewares) {
		return middlewares;
	}

	/**
	 * @param {{ routes: { name: String, methods: [('any'|'get'|'post'|'update'|'delete')], controllers: [String] }[], middlewares: [express.Handler] }[]} middlewares - Build Routes Middlewares
	 */
	buildRoutesMiddlewares(middlewares) {
		return middlewares;
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

export default new FrameworkService();
