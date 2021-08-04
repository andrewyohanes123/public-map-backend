
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { MangroveAmountInstance, MangroveAmountAttributes } from '../models/MangroveAmount';

const mangroveamountsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<MangroveAmountInstance> = Parser.parseQuery<MangroveAmountInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<MangroveAmountInstance> = await models.MangroveAmount.findAndCountAll(parsed);
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
                const mangroveamount: MangroveAmountInstance | null = await models.MangroveAmount.findByPk(id);
                if (!mangroveamount) throw new NotFoundError('MangroveAmount tidak ditemukan');
                const body: OkResponse = { data: mangroveamount };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: MangroveAmountAttributes = req.body;
                const mangroveamount: MangroveAmountInstance = await models.MangroveAmount.create(attributes);
                const body: OkResponse = { data: mangroveamount };

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
                const attributes: MangroveAmountAttributes = req.body;
                const mangroveamount: MangroveAmountInstance | null = await models.MangroveAmount.findByPk(id);
                if (!mangroveamount) throw new NotFoundError('MangroveAmount tidak ditemukan');
                const updatedMangroveAmount: MangroveAmountInstance = await mangroveamount.update(attributes);
                const body: OkResponse = { data: updatedMangroveAmount };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const mangroveamount: MangroveAmountInstance | null = await models.MangroveAmount.findByPk(id);
                if (!mangroveamount) throw new NotFoundError('MangroveAmount tidak ditemukan');
                await mangroveamount.destroy();
                const body: OkResponse = { data: mangroveamount };

                res.json(body);
            },
        ),
    );

    return router;
};

export default mangroveamountsRoutes;
    