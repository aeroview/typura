import {Pred, ValidationError} from '..';

const tester = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;

/**
 * A predicate which checks if a value is a valid UUID v4.
 */
export function uuid(): Pred<string> {

    return (value: unknown): value is string => {

        if (typeof value !== 'string') {

            throw new ValidationError({root: 'must be a valid uuid'});

        }

        if (tester.test(value)) {

            return true;

        } else {

            throw new ValidationError({root: 'must be a valid uuid'});

        }

    };

}
