export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export class ValidationError extends Error {

    messages: Record<string, string>;
    constructor(messages: Record<string, string>) {

        super('INPUT_VALIDATION_ERROR');
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = this.constructor.name;
        this.messages = messages;

    }

}

export type Pred<T> = (value: unknown) => value is T;
export type Infer<T> = T extends Pred<infer U> ? Prettify<U> : never;
export type InferObj<T> = {
    [K in keyof T]: (value: unknown) => value is T;
};

export * as predicates from './predicates';
