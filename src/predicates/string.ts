import {Pred, ValidationError} from '..';

export function string(opts?: {
    len?: {min?: number, max?: number}
}): Pred<string> {

    return (value: unknown): value is string => {

        if (typeof value !== 'string') {

            throw new ValidationError({root: 'must be a string'});

        }

        if (opts?.len?.min && value.length < opts.len.min) {

            throw new ValidationError({root: `must be at least ${opts.len.min} characters`});

        }

        if (opts?.len?.max && value.length > opts.len.max) {

            throw new ValidationError({root: `must be at most ${opts.len.max} characters`});

        }

        return true;

    };

}
