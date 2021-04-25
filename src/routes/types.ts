
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { TypeInstance, TypeAttributes } from '../models/Type';
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const typesRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<TypeInstance> = Parser.parseQuery<TypeInstance>(
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<TypeInstance> = await models.Type.findAndCountAll(parsed);
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
                const type: TypeInstance | null = await models.Type.findByPk(id);
                if (!type) throw new NotFoundError('Type tidak ditemukan');
                const body: OkResponse = { data: type };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: TypeAttributes = req.body;
                const iconsFolderExists: boolean = existsSync(resolve(__dirname, '..', 'icons'));
                if (!iconsFolderExists) mkdirSync(resolve(__dirname, '..', 'icons'));
                const b64: string[] = attributes.icon.split(',');
                const fileName = `${attributes.name.toLocaleLowerCase().replace(/\s/g, '')}.svg`;
                attributes.icon = fileName;
                const type: TypeInstance = await models.Type.create(attributes);
                writeFileSync(resolve(__dirname, '..', 'icons', fileName), b64.length > 1 ? b64[1] : b64[0], 'base64');
                const body: OkResponse = { data: type };

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
                const attributes: TypeAttributes = req.body;
                const type: TypeInstance | null = await models.Type.findByPk(id);
                if (!type) throw new NotFoundError('Type tidak ditemukan');
                const updatedType: TypeInstance = await type.update(attributes);
                const body: OkResponse = { data: updatedType };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const type: TypeInstance | null = await models.Type.findByPk(id);
                if (!type) throw new NotFoundError('Type tidak ditemukan');
                await type.destroy();
                const body: OkResponse = { data: type };

                res.json(body);
            },
        ),
    );

    return router;
};

export default typesRoutes;
