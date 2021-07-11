
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { RegionInstance, RegionAttributes } from '../models/Region';

const regionsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<RegionInstance> = Parser.parseQuery<RegionInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<RegionInstance> = await models.Region.findAndCountAll(parsed);
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
                const region: RegionInstance | null = await models.Region.findByPk(id);
                if (!region) throw new NotFoundError('Region tidak ditemukan');
                const body: OkResponse = { data: region };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: RegionAttributes = req.body;
                const region: RegionInstance = await models.Region.create(attributes);
                const body: OkResponse = { data: region };

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
                const attributes: RegionAttributes = req.body;
                const region: RegionInstance | null = await models.Region.findByPk(id);
                if (!region) throw new NotFoundError('Region tidak ditemukan');
                const updatedRegion: RegionInstance = await region.update(attributes);
                const body: OkResponse = { data: updatedRegion };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const region: RegionInstance | null = await models.Region.findByPk(id);
                if (!region) throw new NotFoundError('Region tidak ditemukan');
                await region.destroy();
                const body: OkResponse = { data: region };

                res.json(body);
            },
        ),
    );

    return router;
};

export default regionsRoutes;
    