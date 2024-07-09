import {Pred, ValidationError} from '..';

export function enumValue<T extends Record<string, string>>(enumObj: T): Pred<T[keyof T]> {

    return (value: unknown): value is T[keyof T] => {

        if (typeof value !== 'string' || !Object.values(enumObj).includes(value as T[keyof T])) {

            throw new ValidationError({root: 'must be a valid enum value'});

        }

        return true;

    };

}
