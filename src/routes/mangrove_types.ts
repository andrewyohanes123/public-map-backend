
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { MangroveTypeInstance, MangroveTypeAttributes } from '../models/MangroveType';

const mangrovetypesRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<MangroveTypeInstance> = Parser.parseQuery<MangroveTypeInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<MangroveTypeInstance> = await models.MangroveType.findAndCountAll(parsed);
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
                const mangrovetype: MangroveTypeInstance | null = await models.MangroveType.findByPk(id);
                if (!mangrovetype) throw new NotFoundError('MangroveType tidak ditemukan');
                const body: OkResponse = { data: mangrovetype };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: MangroveTypeAttributes = req.body;
                const mangrovetype: MangroveTypeInstance = await models.MangroveType.create(attributes);
                const body: OkResponse = { data: mangrovetype };

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
                const attributes: MangroveTypeAttributes = req.body;
                const mangrovetype: MangroveTypeInstance | null = await models.MangroveType.findByPk(id);
                if (!mangrovetype) throw new NotFoundError('MangroveType tidak ditemukan');
                const updatedMangroveType: MangroveTypeInstance = await mangrovetype.update(attributes);
                const body: OkResponse = { data: updatedMangroveType };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const mangrovetype: MangroveTypeInstance | null = await models.MangroveType.findByPk(id);
                if (!mangrovetype) throw new NotFoundError('MangroveType tidak ditemukan');
                await mangrovetype.destroy();
                const body: OkResponse = { data: mangrovetype };

                res.json(body);
            },
        ),
    );

    return router;
};

export default mangrovetypesRoutes;
    