/* eslint-disable max-lines-per-function */
import {Pred, ValidationError, toResult} from '..';

type ErrMsgs = Record<string, string>;

export function array<T>(predicate: Pred<T>): Pred<T[]> {

    return (value: unknown): value is T[] => {

        if (Array.isArray(value) === false) {

            throw new ValidationError({root: 'must be an array'});

        }

        const messages = value.reduce<ErrMsgs>((acc, value, index) => {

            const [err] = toResult(() => predicate((value)));

            if (err && err instanceof ValidationError) {

                // root error
                acc[`[${index}]`] = err.messages.root;

            } else if (err) {

                throw err;

            }

            return acc;

        }, {});

        if (Object.keys(messages).length > 0) {

            throw new ValidationError(messages);

        }

        return true;

    };

}
