/** import modules */
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import nocache from 'nocache';
import cors from 'cors';
import path from 'path';
import http from 'http';
import fs from 'fs'
import socketio from 'socket.io';
import _ from 'lodash';
// @ts-ignore
import geojsonvt from 'geojson-vt'

import ModelFactoryInterface from './models/typings/ModelFactoryInterface';
import createModels from './models';
import createRoutes, { SiriusRouter } from './routes';
import tokenMiddleware from './middlewares/pipes/token';
import websocket from './websocket';
import NotFoundError from './classes/NotFoundError';

/** import .env file configuration */
dotenv.config();

/** app variables */
const app: express.Application = express();
const web: http.Server = new http.Server(app);
const io: socketio.Server = socketio(web);
const models: ModelFactoryInterface = createModels();
const allowOrigins: string | string[] = process.env.ALLOW_ORIGIN
	? process.env.ALLOW_ORIGIN === '*'
		? '*'
		: process.env.ALLOW_ORIGIN.split(',').map((origin: string) => origin.trim())
	: `http://localhost:${process.env.PORT || 1234}`;

/** setup websocket */
websocket(io);

/** middlewares */
app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '1024mb' }));
app.use(bodyParser.urlencoded({ limit: process.env.REQUEST_LIMIT || '1024mb', extended: true }));
app.use(cors({ origin: allowOrigins, credentials: true }));
app.use(tokenMiddleware(models)); // token auth
app.use(nocache()); // no cache

/** router configuration */
const routes: SiriusRouter[] = createRoutes(app, models, io);
const apiURL: string = process.env.API_URL ? process.env.API_URL : '/api';
let routeData: any = {};

/** extract route data */
routes.forEach((route: SiriusRouter) => {
	const key: string = `${apiURL}/${route.basepoint}`;
	routeData[key] = { endpoints: [] };
	route.stack.forEach((info: any) => {
		let { route }: { route: any } = info;
		if (route) {
			let endpoint: string = route.path;
			let verbs: any = route.methods.get
				? 'GET'
				: route.methods.post
					? 'POST'
					: route.methods.put
						? 'PUT'
						: 'DELETE';
			let keys: any = info.keys.map((t: any) => t.name);
			routeData[key].endpoints.push({ endpoint, verbs, keys });
		}
	});
});

/** meta route for inspector */
app.get(
	'/app_meta',
	(req: express.Request, res: express.Response): void => {
		let data: { routes: any[]; models: any[] } = { routes: [], models: [] };
		Object.keys(routeData).forEach((route: any) => {
			data.routes.push({
				basepoint: route,
				endpoints: routeData[route].endpoints,
			});
		});
		Object.keys(models).forEach((modelName: string) => {
			if (['sequelize', 'Sequelize'].indexOf(modelName) === -1) {
				data.models.push({
					name: modelName,
					basepoint: models[modelName].getTableName(),
					attributes: models[modelName].rawAttributes,
				});
			}
		});
		res.json(data);
	},
);

app.get('/icon/:id', async (req: express.Request, res: express.Response): Promise<void> => {
	const type = await models.Type.findById(req.params.id);
	if (type) {
		// sharp(path.resolve(__dirname, 'icons', type.icon)).png().toFile(path.resolve(__dirname, 'icons', `temp${type.id}.png`)).then(resp => {
			const base64 = fs.readFileSync(path.resolve(__dirname, 'icons', `${type.icon}`), 'base64');
			// console.log(resp)
			// res.sendFile(path.resolve(__dirname, 'icons', `temp${type.id}.png`))
			res.send({ data: base64 });
		// })
	} else {
		throw new NotFoundError('errno');
	}
	// res.sendFile()
});

app.get('/picture/:id', async (req: express.Request, res: express.Response): Promise<void> => {
	const picture = await models.Picture.findById(req.params.id);
	if (picture) {
			res.sendFile(path.resolve(__dirname, '..', 'uploads', `${picture.file}`));
	} else {
		throw new NotFoundError('errno');
	}
	// res.sendFile()
});

app.get('/map/base', (req: express.Request, res: express.Response): void => {
	// const {x, y, z}: any = req.params;
	// const json = fs.readFileSync(path.resolve(__dirname, '..', 'basemaps', 'empty.json'));
	// const tile = geojsonvt(json);
	// const vt = tile.getTile(z, x, y).features;
	res.send(fs.readFileSync(path.resolve(__dirname, '..', 'basemaps', 'empty.json')));
});

/** root route */
if (process.env.NODE_ENV === 'development') {
	app.use(express.static(path.resolve(__dirname, '..', 'inspector')));
} else {
	app.use(express.static(path.resolve(__dirname, '..', 'frontend')));
}

/** sync models & start server */
models.sequelize
	.sync({
		force: process.env.DB_FORCE_RENEW === 'true',
		alter: false,
	})
	.then(
		(): void => {
			web.listen(
				process.env.PORT || 1234,
				(): void => {
					console.log('App running');
				},
			);
		},
	);
