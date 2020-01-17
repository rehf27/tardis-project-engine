export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PartialWithArray<T> = {
	[P in keyof T]?: T[P] | Array<T[P]>;
};
