import {Pred, ValidationError} from '..';

export function literal<T extends any>(expected: T): Pred<T> {

    return (value: unknown): value is T => {

        if (value !== expected) {

            throw new ValidationError({root: `must be ${expected}`});

        }

        return true;

    };

}
