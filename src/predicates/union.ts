import {Pred, toResult, ValidationError} from '..';

/**
 * Extracts the type guarded by a predicate function.
 */
type ExtractGuardedType<P> = P extends (value: unknown) => value is infer T ? T : never;

/**
 * Returns a predicate that accepts any value passing one of the given predicates.
 * If none match and at least one throws, the error is rethrown.
 */
export function union<T extends readonly Pred<any>[]>(
    predicates: [...T],
    errorMessage: string
): (value: unknown) => value is ExtractGuardedType<T[number]> {

    return (value: unknown): value is ExtractGuardedType<T[number]> => {

        for (const predicate of predicates) {

            const [, result] = toResult(() => predicate(value));

            if (result) return true;

        }

        throw new ValidationError({
            root: errorMessage,
        });

    };

}
