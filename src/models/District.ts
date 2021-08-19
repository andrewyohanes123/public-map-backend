import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface DistrictAttributes {
  id?: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DistrictInstance extends Sequelize.Instance<DistrictAttributes>, DistrictAttributes {
}

export interface Associate {
  (models: ModelFactoryInterface): void;
}

export const DistrictFactory: Factory<DistrictInstance, DistrictAttributes> = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<DistrictInstance, DistrictAttributes> => {
  const attributes: SequelizeAttributes<DistrictAttributes> = {
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
    }
  };
  const District: Sequelize.Model<DistrictInstance, DistrictAttributes> = sequelize.define<
    DistrictInstance,
    DistrictAttributes
  >('district', attributes, { underscored: true });

  District.associate = (models: ModelFactoryInterface): void => {
    District.hasMany(models.Point, { onDelete: 'cascade' });
  };

  return District;
};
