export type AllNullable<T extends Record<any, any>> = { [K in keyof T]: T[K] | null };
