import {Pred, ValidationError} from '..';

export function boolean(): Pred<boolean> {

    return (value: unknown): value is boolean => {

        if (typeof value !== 'boolean') {

            throw new ValidationError({root: 'must be a boolean'});

        }

        return true;

    };

}
