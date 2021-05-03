import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface RegionAttributes {
	id?: number;
	geometry: Object,
  properties: Object,
  name: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface RegionInstance extends Sequelize.Instance<RegionAttributes>, RegionAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const RegionFactory: Factory<RegionInstance, RegionAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<RegionInstance, RegionAttributes> => {
	const attributes: SequelizeAttributes<RegionAttributes> = {
		geometry: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false
    },
    properties: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
	};
	const Region: Sequelize.Model<RegionInstance, RegionAttributes> = sequelize.define<
		RegionInstance,
		RegionAttributes
	>('region', attributes, { underscored: true });

	Region.associate = (models: ModelFactoryInterface): void => {
		
	};

	return Region;
};
