import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface MangroveTypeAttributes {
	id?: number;
	name: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface MangroveTypeInstance extends Sequelize.Instance<MangroveTypeAttributes>, MangroveTypeAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const MangroveTypeFactory: Factory<MangroveTypeInstance, MangroveTypeAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<MangroveTypeInstance, MangroveTypeAttributes> => {
	const attributes: SequelizeAttributes<MangroveTypeAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		}
	};
	const MangroveType: Sequelize.Model<MangroveTypeInstance, MangroveTypeAttributes> = sequelize.define<
		MangroveTypeInstance,
		MangroveTypeAttributes
	>('mangrove_type', attributes, { underscored: true });

	MangroveType.associate = (models: ModelFactoryInterface): void => {
		MangroveType.hasMany(models.MangroveAmount, { onDelete: 'cascade' });
	};

	return MangroveType;
};
