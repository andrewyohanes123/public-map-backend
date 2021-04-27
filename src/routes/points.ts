
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { PointInstance, PointAttributes } from '../models/Point';

const pointsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<PointInstance> = Parser.parseQuery<PointInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<PointInstance> = await models.Point.findAndCountAll(parsed);
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
                const point: PointInstance | null = await models.Point.findByPk(id, {
                    include: [
                        {model: models.Type},
                        {model: models.Picture}
                    ]
                });
                if (!point) throw new NotFoundError('Point tidak ditemukan');
                const body: OkResponse = { data: point };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: PointAttributes = req.body;
                const point: PointInstance = await models.Point.create(attributes);
                const body: OkResponse = { data: point };

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
                const attributes: PointAttributes = req.body;
                const point: PointInstance | null = await models.Point.findByPk(id);
                if (!point) throw new NotFoundError('Point tidak ditemukan');
                const updatedPoint: PointInstance = await point.update(attributes);
                const body: OkResponse = { data: updatedPoint };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const point: PointInstance | null = await models.Point.findByPk(id);
                if (!point) throw new NotFoundError('Point tidak ditemukan');
                await point.destroy();
                const body: OkResponse = { data: point };

                res.json(body);
            },
        ),
    );

    return router;
};

export default pointsRoutes;
    