import Sequelize from 'sequelize';
import ModelFactoryInterface from './typings/ModelFactoryInterface';
import { UserFactory } from './User';
import { TokenFactory } from './Token';
import { PointFactory } from './Point';
import { PictureFactory } from './Picture';
import { TypeFactory } from './Type';
import { RegionFactory } from './Region';
import { LayerFactory } from './Layer';
import { MangroveAmountFactory } from './MangroveAmount';
import { MangroveTypeFactory } from './MangroveType';

const createModels: Function = (): ModelFactoryInterface => {
	const {
		DB_HOST,
		DB_DIALECT,
		DB_DATABASE = 'sirius',
		DB_USER = 'sirius',
		DB_PASS = 'sirius',
	}: NodeJS.ProcessEnv = process.env;
	const sequelize: Sequelize.Sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
		host: DB_HOST,
		dialect: DB_DIALECT,
		dialectOptions: {
			useUTC: true,
		},
		timezone: '+08:00',
		operatorsAliases: true,
		logging: process.env.SYSTEM_LOGGING === 'true' ? console.log : (msg: string) => {},
	});
	const db: ModelFactoryInterface = {
		sequelize,
		Sequelize,
		User: UserFactory(sequelize, Sequelize),
		Token: TokenFactory(sequelize, Sequelize),
		Point: PointFactory(sequelize, Sequelize),
		Picture: PictureFactory(sequelize, Sequelize),
		Type: TypeFactory(sequelize, Sequelize),
		Region: RegionFactory(sequelize, Sequelize),
		Layer: LayerFactory(sequelize, Sequelize),
		MangroveAmount: MangroveAmountFactory(sequelize, Sequelize),
		MangroveType: MangroveTypeFactory(sequelize, Sequelize)
	};

	Object.keys(db).forEach(
		(model: string): void => {
			if (db[model].associate) {
				db[model].associate(db);
			}
		},
	);

	return db;
};

export default createModels;
