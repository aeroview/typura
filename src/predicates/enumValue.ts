import {Pred, ValidationError} from '..';

export function enumValue<T extends Record<string, string>>(enumObj: T): Pred<keyof T> {

    return (value: unknown): value is keyof T => {

        if (typeof value !== 'string' || !(value in enumObj)) {

            throw new ValidationError({root: 'must be a valid enum value'});

        }

        return true;

    };

}
