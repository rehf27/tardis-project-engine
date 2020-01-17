// tslint:disable no-identical-functions
import * as Knex from 'knex';
import db from '../lib/db';

import { camelCase, snakeCase } from 'src/lib/changeCase';
import { PartialWithArray } from 'src/types/utils';

export default class Repository<T = any> {
	protected db;
	private tableName;

	constructor(tableName: string) {
		this.db = db;
		this.tableName = tableName;
	}

	public async findOne(selectors: PartialWithArray<T> = {}): Promise<T> {
		const record = await this.manyQuery(selectors).first();

		return camelCase(record);
	}

	public async findMany(selectors: PartialWithArray<T> = {}): Promise<T[]> {
		const query = this.manyQuery(selectors);

		return query.asCallback((records :any) => { records.map(record => camelCase(record))});
	}

	public async insertBulk(records: Array<Partial<T>> = []): Promise<T[]> {
		if (records.length === 0) {
			return null;
		}

		const data = snakeCase(records);

		const insertedRecords = await this.db(this.tableName)
			.insert(data)
			.returning('*');

		if (!insertedRecords) {
			return null;
		}

		return insertedRecords.map(camelCase);
	}

	public async insertOne(values: Partial<T> = {}): Promise<T> {
		const records = await this.insertBulk([values]);

		if (!records) {
			return null;
		}

		return records[0];
	}

	public async updateOne(selectors: Partial<T> = {}, changes: Partial<T> = {}): Promise<T> {
		const criteria = snakeCase(selectors);
		const updates = snakeCase(changes);

		const records = await this.db(this.tableName)
			.where(criteria)
			.first()
			.update(updates)
			.returning('*');

		if (!records) {
			return null;
		}

		return camelCase(records[0]);
	}

	public async updateAll(selectors: PartialWithArray<T> = {}, changes: Partial<T> = {}): Promise<T[]> {
		const query = this.manyQuery(selectors);
		const updates = snakeCase(changes);

		const records = await query.update(updates).returning('*');

		if (!records) {
			return null;
		}

		return camelCase(records);
	}

	public async destroyOne(selectors: Partial<T> = {}): Promise<boolean> {
		const criteria = snakeCase(selectors);

		const result = await this.raw()
			.where(criteria)
			.first()
			.del();

		return result > 0;
	}

	public async destroyAll(selectors: PartialWithArray<T> = {}): Promise<boolean> {
		const query = this.manyQuery(selectors);
		const result = await query.del();

		return result > 0;
	}

	public raw(): Knex.QueryBuilder {
		return this.db(this.tableName);
	}

	protected manyQuery(selectors: PartialWithArray<T> = {}): Knex.QueryBuilder {
		const criteria = snakeCase(selectors);

		let query = this.db(this.tableName);

		Object.keys(criteria).forEach(k => {
			if (Array.isArray(criteria[k])) {
				query = query.whereIn(k, criteria[k]);
			} else {
				query = query.where(k, criteria[k]);
			}
		});

		return query;
	}
}
