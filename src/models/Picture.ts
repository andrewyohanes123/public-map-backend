import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface PictureAttributes {
	id?: number;
	description?: string;
  file: string;
  point_id?: number;
  user_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface PictureInstance extends Sequelize.Instance<PictureAttributes>, PictureAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const PictureFactory: Factory<PictureInstance, PictureAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<PictureInstance, PictureAttributes> => {
	const attributes: SequelizeAttributes<PictureAttributes> = {
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
    file: {
      type: DataTypes.TEXT,
      allowNull: false
    }
	};
	const Picture: Sequelize.Model<PictureInstance, PictureAttributes> = sequelize.define<
		PictureInstance,
		PictureAttributes
	>('picture', attributes, { underscored: true });

	Picture.associate = (models: ModelFactoryInterface): void => {
		Picture.belongsTo(models.Point, { onDelete: 'cascade' });
		Picture.belongsTo(models.User, { onDelete: 'cascade' });
	};

	return Picture;
};
