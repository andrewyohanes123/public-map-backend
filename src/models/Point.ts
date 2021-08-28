import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface PointAttributes {
	id?: number;
	name: string;
  type: string;
	properties: {[any: string]: any};
	geometry: {[any: string]: any};
	surface_area: number;
  type_id?: number;
	point_id?: number;
  user_id?: number;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PointInstance extends Sequelize.Instance<PointAttributes>, PointAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const PointFactory: Factory<PointInstance, PointAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<PointInstance, PointAttributes> => {
	const attributes: SequelizeAttributes<PointAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		properties: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		geometry: {
			type: DataTypes.JSONB,
			allowNull: false
		},
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
		surface_area: {
			type: DataTypes.INTEGER(32),
			allowNull: false
		}
	};
	const Point: Sequelize.Model<PointInstance, PointAttributes> = sequelize.define<
		PointInstance,
		PointAttributes
	>('point', attributes, { underscored: true });

	Point.associate = (models: ModelFactoryInterface): void => {
		Point.hasMany(models.Picture, { onDelete: 'cascade' });
		Point.belongsTo(models.Type, { onDelete: 'cascade' });
		Point.belongsTo(models.District, { onDelete: 'cascade' });
		Point.belongsTo(models.User, { onDelete: 'cascade' });
		Point.hasMany(models.MangroveAmount, { onDelete: 'cascade' });
	};

	return Point;
};
