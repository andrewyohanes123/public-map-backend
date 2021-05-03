import Sequelize from 'sequelize';
import { UserInstance, UserAttributes } from '../User';
import { TokenInstance, TokenAttributes } from '../Token';
import { PointAttributes, PointInstance } from '../Point';
import { PictureAttributes, PictureInstance } from '../Picture';
import { TypeAttributes, TypeInstance } from '../Type';
import { RegionAttributes, RegionInstance } from '../Region';
import { LayerAttributes, LayerInstance } from '../Layer';

interface Obj {
	[s: string]: any;
}

export default interface ModelFactoryInterface extends Obj {
	sequelize: Sequelize.Sequelize;
	Sequelize: Sequelize.SequelizeStatic;
	User: Sequelize.Model<UserInstance, UserAttributes>;
	Token: Sequelize.Model<TokenInstance, TokenAttributes>;
	Point: Sequelize.Model<PointInstance, PointAttributes>;
	Picture: Sequelize.Model<PictureInstance, PictureAttributes>;
	Type: Sequelize.Model<TypeInstance, TypeAttributes>;
	Region: Sequelize.Model<RegionInstance, RegionAttributes>;
	Layer: Sequelize.Model<LayerInstance, LayerAttributes>;
}
