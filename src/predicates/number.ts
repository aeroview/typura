import {Pred, ValidationError} from '..';

export function number(opts?: {
    range?: {min: number, max: number}
}): Pred<number> {

    return (value: unknown): value is number => {

        if (typeof value !== 'number') {

            throw new ValidationError({root: 'must be a number'});

        }

        if (opts?.range && (value < opts.range.min || value > opts.range.max)) {

            throw new ValidationError({root: `must be between ${opts.range.min} and ${opts.range.max}`});

        }

        return true;

    };

}
