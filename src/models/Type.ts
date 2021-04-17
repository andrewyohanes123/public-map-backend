import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface TypeAttributes {
	id?: number;
	name: string;
	icon: string;
  color: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface TypeInstance extends Sequelize.Instance<TypeAttributes>, TypeAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const TypeFactory: Factory<TypeInstance, TypeAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TypeInstance, TypeAttributes> => {
	const attributes: SequelizeAttributes<TypeAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
    icon: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
	};
	const Type: Sequelize.Model<TypeInstance, TypeAttributes> = sequelize.define<
		TypeInstance,
		TypeAttributes
	>('type', attributes, { underscored: true });

	Type.associate = (models: ModelFactoryInterface): void => {
		Type.hasMany(models.Point, { onDelete: 'cascade' });
	};

	return Type;
};
