import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { DistrictInstance, DistrictAttributes } from '../models/District';

const districtsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<DistrictInstance> = Parser.parseQuery<DistrictInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<DistrictInstance> = await models.District.findAndCountAll(parsed);
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
                const district: DistrictInstance | null = await models.District.findByPk(id);
                if (!district) throw new NotFoundError('District tidak ditemukan');
                const body: OkResponse = { data: district };

                res.json(body);
            },
        ),
    );

    // router.post(
    //     '/',
    //     // validation,
    //     a(
    //         async (req: express.Request, res: express.Response): Promise<void> => {
    //             const attributes: DistrictAttributes = req.body;
    //             const district: DistrictInstance = await models.District.create(attributes);
    //             const body: OkResponse = { data: district };

    //             res.json(body);
    //         },
    //     ),
    // );

    // router.put(
    //     '/:id',
    //     // validation,
    //     a(
    //         async (req: express.Request, res: express.Response): Promise<void> => {
    //             const { id }: any = req.params;
    //             const attributes: DistrictAttributes = req.body;
    //             const district: DistrictInstance | null = await models.District.findByPk(id);
    //             if (!district) throw new NotFoundError('District tidak ditemukan');
    //             const updatedDistrict: DistrictInstance = await district.update(attributes);
    //             const body: OkResponse = { data: updatedDistrict };

    //             res.json(body);
    //         },
    //     ),
    // );

    // router.delete(
    //     '/:id',
    //     a(
    //         async (req: express.Request, res: express.Response): Promise<void> => {
    //             const { id }: any = req.params;
    //             const district: DistrictInstance | null = await models.District.findByPk(id);
    //             if (!district) throw new NotFoundError('District tidak ditemukan');
    //             await district.destroy();
    //             const body: OkResponse = { data: district };

    //             res.json(body);
    //         },
    //     ),
    // );

    return router;
};

export default districtsRoutes;
    