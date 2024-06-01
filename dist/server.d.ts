import type { Request, Router } from 'express';
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type Resolver<I, O, C> = (input: I, context: C) => O;
export type ExpressContextResolver<C> = (req: Request) => C;
type InferResolver<N, R> = R extends Resolver<infer I, infer O, any> ? {
    name: N;
    input: I;
    output: UnwrapPromise<O>;
} : never;
export type InferAPI<T> = {
    [P in keyof T]: InferResolver<P, T[P]>;
};
export declare function createAPI(router: Router, api: {
    [name: string]: Resolver<any, any, any>;
}, contextResolver?: ExpressContextResolver<any>): void;
export {};
