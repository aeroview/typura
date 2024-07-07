import {InferShape, Pred, ValidationError} from '..';
import {toResult} from '../lib/toResult';

type ObjectOptions = {
    allowUnknownKeys?: boolean
};

// eslint-disable-next-line max-lines-per-function
export function object<T extends Record<string, Pred<any>>>(
    schema: T,
    options?: ObjectOptions
): Pred<InferShape<T>> {

    if (typeof schema !== 'object') throw new Error('invalid schema, must be object');

    return (value: unknown): value is InferShape<T> => {

        if (typeof value !== 'object' || !value) {

            throw new ValidationError({root: `must be an object with keys ${Object.keys(schema).join(', ')}`});

        }

        // go through each key in the schema
        const messages: Record<string, string> = Object.entries(schema)
            .reduce<Record<string, string>>((acc, [key, predicate]) => {

            const [err] = toResult(() => predicate((value as Record<string, unknown>)[key]));
            const isInvalid = err instanceof ValidationError;

            if (isInvalid && Object.keys(err.messages).length === 1 && err.messages.root) {

                // root error
                acc[key] = err.messages.root;

            } else if (isInvalid) {

                // nested errors
                Object.entries(err.messages).forEach(([subKey, subMessage]) => {

                    acc[`${key}.${subKey}`] = subMessage;

                });

            }

            return acc;

        }, {});

        // go through each key in the value
        if (!options?.allowUnknownKeys) {

            Object.keys(value as Record<string, unknown>).forEach((key) => {

                if (!schema[key]) {

                    messages[key] = 'unknown key';

                }

            });

        }

        if (Object.keys(messages).length > 0) {

            throw new ValidationError(messages);

        }

        return true;

    };

}
