import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface LayerAttributes {
  id?: number;
  geometry: Object,
  properties: Object,
  name: string;
  region_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface LayerInstance extends Sequelize.Instance<LayerAttributes>, LayerAttributes {
}

export interface Associate {
  (models: ModelFactoryInterface): void;
}

export const LayerFactory: Factory<LayerInstance, LayerAttributes> = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<LayerInstance, LayerAttributes> => {
  const attributes: SequelizeAttributes<LayerAttributes> = {
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
  const Layer: Sequelize.Model<LayerInstance, LayerAttributes> = sequelize.define<
    LayerInstance,
    LayerAttributes
  >('layer', attributes, { underscored: true });

  Layer.associate = (models: ModelFactoryInterface): void => {
    Layer.belongsTo(models.Region, { onDelete: 'cascade', onUpdate: 'cascade' });
  };

  return Layer;
};
