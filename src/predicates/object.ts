import {InferShape, Pred, ValidationError} from '..';
import {toResult} from '../lib/toResult';

export function object
<T extends Record<string, Pred<any>>>(schema: T):
Pred<InferShape<T>> {

    if (typeof schema !== 'object') throw new Error('invalid schema, must be object');

    return (value: unknown): value is InferShape<T> => {

        if (typeof value !== 'object' || !value) {

            throw new ValidationError({root: `must be an object with keys ${Object.keys(schema).join(', ')}`});

        }

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

        if (Object.keys(messages).length > 0) {

            throw new ValidationError(messages);

        }

        return true;

    };

}
