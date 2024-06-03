export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export class ValidationError extends Error {

    messages: Record<string, string>;
    constructor(messages: Record<string, string>) {

        super('ValidationError');
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = this.constructor.name;
        this.messages = messages;

    }

}

export type Pred<T> = (value: unknown) => value is T;
export type Infer<T> = T extends Pred<infer U> ? U : never;
export type InferShape<T extends Record<string, Pred<any>>> = {
    [K in keyof T]: T[K] extends Pred<infer U> ? U : never;
};

export * as predicates from './predicates';
