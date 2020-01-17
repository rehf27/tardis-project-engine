export interface ISchema {
	params?: object;
	query?: object;
	body?: object;
}

export interface IRoute {
	method: string;
	path: string;
	schema?: ISchema;
	verify?: any;
	controller: () => any;
}
