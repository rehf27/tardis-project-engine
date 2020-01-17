import * as Knex from 'knex';
import * as winston from 'winston';

import { IChangeCase } from 'src/lib/changeCase';
import { IRepositories, repos } from 'src/repositories';
import { IServices, services } from 'src/services';

import { changeCase, db, logger } from '../lib';

export const contextObj = {
	db,
	changeCase,
	logger,
	...repos,
	...services
};

const context = (req, res, next) => {
	req.context = { ...contextObj };

	next();
};

export type IContext = IRepositories & IServices & {
	db: Knex;
	changeCase: IChangeCase;
	logger: winston.Logger;
};

export default context;
