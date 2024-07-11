/* eslint-disable max-lines-per-function */
import {Pred, ValidationError, toResult} from '..';

type ErrMsgs = Record<string, string>;
type Opts = {
    len?: {min?: number, max?: number}
};

export function array<T>(
    predicate: Pred<T>,
    options?: Opts
): Pred<T[]> {

    return (value: unknown): value is T[] => {

        if (Array.isArray(value) === false) {

            throw new ValidationError({root: 'must be an array'});

        }

        if (
            options?.len?.min
                && options?.len?.max
                && options.len.min === options.len.max
                && value.length !== options.len.min
        ) {

            throw new ValidationError({root: `must have exactly ${options.len.min} item(s)`});

        }

        if (options?.len?.min && value.length < options.len.min) {

            throw new ValidationError({root: `must have at least ${options.len.min} item(s)`});

        }

        if (options?.len?.max && value.length > options.len.max) {

            throw new ValidationError({root: `must have at most ${options.len.max} item(s)`});

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
