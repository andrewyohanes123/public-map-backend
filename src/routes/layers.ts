
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { LayerInstance, LayerAttributes } from '../models/Layer';

const layersRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<LayerInstance> = Parser.parseQuery<LayerInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<LayerInstance> = await models.Layer.findAndCountAll(parsed);
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
                const layer: LayerInstance | null = await models.Layer.findByPk(id);
                if (!layer) throw new NotFoundError('Layer tidak ditemukan');
                const body: OkResponse = { data: layer };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: LayerAttributes = req.body;
                const layer: LayerInstance = await models.Layer.create(attributes);
                const body: OkResponse = { data: layer };

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
                const attributes: LayerAttributes = req.body;
                const layer: LayerInstance | null = await models.Layer.findByPk(id);
                if (!layer) throw new NotFoundError('Layer tidak ditemukan');
                const updatedLayer: LayerInstance = await layer.update(attributes);
                const body: OkResponse = { data: updatedLayer };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const layer: LayerInstance | null = await models.Layer.findByPk(id);
                if (!layer) throw new NotFoundError('Layer tidak ditemukan');
                await layer.destroy();
                const body: OkResponse = { data: layer };

                res.json(body);
            },
        ),
    );

    return router;
};

export default layersRoutes;
    