import * as knex from 'knex';
import options from '../config';

export default knex(options.db as any);
