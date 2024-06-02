import {Pred} from '..';

export function optional<T>(predicate: Pred<T>): Pred<T|undefined> {

    return (value: any): value is T => {

        if (value === undefined) return true;
        return predicate(value);

    };

}
