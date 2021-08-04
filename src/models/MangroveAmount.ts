import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface MangroveAmountAttributes {
	id?: number;
	amount: number;
  mangrove_type_id?: number;
  point_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface MangroveAmountInstance extends Sequelize.Instance<MangroveAmountAttributes>, MangroveAmountAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const MangroveAmountFactory: Factory<MangroveAmountInstance, MangroveAmountAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<MangroveAmountInstance, MangroveAmountAttributes> => {
	const attributes: SequelizeAttributes<MangroveAmountAttributes> = {
		amount: {
			type: DataTypes.INTEGER(32),
			allowNull: false,
		}
	};
	const MangroveAmount: Sequelize.Model<MangroveAmountInstance, MangroveAmountAttributes> = sequelize.define<
		MangroveAmountInstance,
		MangroveAmountAttributes
	>('mangrove_amount', attributes, { underscored: true });

	MangroveAmount.associate = (models: ModelFactoryInterface): void => {
		MangroveAmount.belongsTo(models.MangroveType, { onDelete: 'cascade' });
		MangroveAmount.belongsTo(models.Point, { onDelete: 'cascade' });
	};

	return MangroveAmount;
};
