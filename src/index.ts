export class ValidationError extends Error {

    messages: Record<string, string>;
    constructor(messages: Record<string, string>) {

        super('ValidationError');
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = this.constructor.name;
        this.messages = messages;

    }

}

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
export type Pred<T> = (value: unknown) => value is T;
export type Infer<T> = T extends Pred<infer U> ? Prettify<U> : never;
export type IsOptional<T> = undefined extends T ? true : false;

type RequiredKeys<T extends Record<string, Pred<any>>> = {
    [K in keyof T]: IsOptional<Infer<T[K]>> extends true ? never : K;
}[keyof T];
type OptionalKeys<T extends Record<string, Pred<any>>> = {
    [K in keyof T]: IsOptional<Infer<T[K]>> extends true ? K : never;
}[keyof T];

export type InferShape<T extends Record<string, Pred<any>>> = Pick<T, RequiredKeys<T>> &
Partial<Pick<T, OptionalKeys<T>>> extends infer O
    ? { [K in keyof O]: Infer<O[K]> }
    : never;

export * as predicates from './predicates';
export * from './lib/toResult';
