import express from 'express';
import bcrypt from 'bcrypt';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { UserInstance } from '../models/User';
import NotFoundError from '../classes/NotFoundError';
import { createUser, editUser } from './users.validation';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
// import onlyAuth from '../middlewares/protector/auth';

const usersRoute: Routes = (
	app: express.Application,
	models: ModelFactoryInterface,
): express.Router => {
	const router: express.Router = express.Router();

	// router.use(onlyAuth());

	router.get(
		'/',
		Parser.validateQ(),
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const parsed: sequelize.FindOptions<UserInstance> = Parser.parseQuery<UserInstance>(
					req.query.q,
					models,
				);
				const data: PaginatedResult<UserInstance> = await models.User.findAndCountAll(parsed);
				const body: OkResponse = { data };

				res.json(body);
			},
		),
	);

	router.get(
		'/:id',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const user: UserInstance | null = await models.User.findOne({ where: { id } });
				if (!user) throw new NotFoundError('User tidak ditemukan');
				const body: OkResponse = { data: user };

				res.json(body);
			},
		),
	);

	router.post(
		'/',
		createUser,
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const {
					name,
					username,
					password,
					type
				}: { name: string; username: string; password: string, type: 'Administrator' | 'Contributor' } = req.body;
				const user: UserInstance = await models.User.create({
					name,
					username,
					password: bcrypt.hashSync(password, 10),
					type
				});
				const body: OkResponse = { data: user };

				res.json(body);
			},
		),
	);

	router.put(
		'/:id',
		editUser,
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const {
					name,
					username,
					password,
					type
				}: { name: string; username: string; password?: string, type: 'Contributor' | 'Administrator' } = req.body;
				const user: UserInstance | null = await models.User.findOne({ where: { id } });
				if (!user) throw new NotFoundError('User tidak ditemukan');
				if (typeof password !== 'undefined') {
					await user.update({ name, username, password: bcrypt.hashSync(password, 10), type });
				} else {
					await user.update({ name, username, type });
				}
				const body: OkResponse = { data: user };

				res.json(body);
			},
		),
	);

	router.delete(
		'/:id',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const user: UserInstance | null = await models.User.findOne({ where: { id } });
				if (!user) throw new NotFoundError('User tidak ditemukan');
				await user.destroy();
				const body: OkResponse = { data: user };

				res.json(body);
			},
		),
	);

	return router;
};

export default usersRoute;
