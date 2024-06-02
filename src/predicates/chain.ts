import {Pred} from '..';

/**
 * Returns a predicate that checks if all predicates in the chain return true.
 * - All predicates must be of the same type (e.g. string, number, boolean, T).
 * - Predicates are executed in order.
 */
export function chain<T>(...predicates: Pred<T>[]): Pred<T> {

    return (value: unknown): value is T => {

        for (const predicate of predicates) {

            predicate(value);

        }

        return true;

    };

}
