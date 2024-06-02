import {Pred, ValidationError} from '..';

export function custom<T>(
    predicate: (value: T) => boolean,
    errorMessage: string
): Pred<T> {

    return (value: unknown): value is T => {

        if (!predicate(value as T)) {

            throw new ValidationError({root: errorMessage});

        }

        return true;

    };

}
