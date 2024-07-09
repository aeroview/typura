import {Pred, ValidationError} from '..';

export function regex(
    exp: RegExp,
    errorMessage: string
): Pred<string> {

    return (value: unknown): value is string => {

        if (!exp.test(value as string)) {

            throw new ValidationError({root: errorMessage});

        }

        return true;

    };

}
