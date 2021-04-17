import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface UserAttributes {
	id?: number;
	name: string;
	username: string;
	password: string;
	type: 'Administrator' | 'Contributor';
	created_at?: Date;
	updated_at?: Date;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const UserFactory: Factory<UserInstance, UserAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<UserInstance, UserAttributes> => {
	const attributes: SequelizeAttributes<UserAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING(191),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM(['Administrator', 'Contributor']),
			allowNull: false,
			defaultValue: 'Administrator'
		}
	};
	const User: Sequelize.Model<UserInstance, UserAttributes> = sequelize.define<
		UserInstance,
		UserAttributes
	>('user', attributes, { underscored: true });

	User.associate = (models: ModelFactoryInterface): void => {
		User.hasMany(models.Token, { onDelete: 'cascade' });
		User.hasMany(models.Point, { onDelete: 'cascade' });
	};

	return User;
};
