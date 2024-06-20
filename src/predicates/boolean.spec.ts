import {test} from 'hoare';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {boolean} from './boolean';
import {removeStackFromErr} from '../lib/removeStackFromErr';


test('pred should return true for booleans', (assert) => {

    const pred = boolean();

    assert.equal(pred(true), true);
    assert.equal(pred(false), true);

});

test('pred should throw ValidationError for invalid value', (assert) => {

    const pred = boolean();

    const expected = removeStackFromErr(new ValidationError({
        root: 'must be a boolean',
    }));

    assert.equal(
        removeStackFromErr(toResult(() => pred(42))[0]!),
        expected,
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('false'))[0]!),
        expected,
    );

});
