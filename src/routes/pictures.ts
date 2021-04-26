
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { PictureInstance, PictureAttributes } from '../models/Picture';
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

const picturesRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<PictureInstance> = Parser.parseQuery<PictureInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<PictureInstance> = await models.Picture.findAndCountAll(parsed);
                const body: OkResponse = { data };

                res.json(body);
            },
        ),
    );

    router.get(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const picture: PictureInstance | null = await models.Picture.findByPk(id);
                if (!picture) throw new NotFoundError('Picture tidak ditemukan');
                const body: OkResponse = { data: picture };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: PictureAttributes = req.body;
                const b64: string[] = attributes.file.split(',');
                const date = new Date();
                const fileBuffer = Buffer.from(b64[1], 'base64');
                if (!fs.existsSync(path.resolve(__dirname, '..', '..', 'uploads'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', 'uploads'));
                const fileName: string = `${attributes.point_id}.${date.toISOString().replace(/[\-\:\.]/g, '')}.jpg`
                await sharp(fileBuffer).jpeg({quality: 60}).toFile(path.resolve(__dirname, '..', '..', 'uploads', fileName));
                const picture: PictureInstance = await models.Picture.create({
                    ...attributes,
                    file: fileName,                
                });
                const body: OkResponse = { data: picture };

                res.json(body);
            },
        ),
    );

    router.put(
        '/:id',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const attributes: PictureAttributes = req.body;
                const picture: PictureInstance | null = await models.Picture.findByPk(id);
                if (!picture) throw new NotFoundError('Picture tidak ditemukan');
                const updatedPicture: PictureInstance = await picture.update(attributes);
                const body: OkResponse = { data: updatedPicture };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const picture: PictureInstance | null = await models.Picture.findByPk(id);
                if (!picture) throw new NotFoundError('Picture tidak ditemukan');
                await picture.destroy();
                const body: OkResponse = { data: picture };

                res.json(body);
            },
        ),
    );

    return router;
};

export default picturesRoutes;
    