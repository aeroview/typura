import {test} from 'hoare';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {custom} from './custom';
import {removeStackFromErr} from '../lib/removeStackFromErr';

test('should return a predicate', (assert) => {

    const pred = custom(() => true, 'always true');

    assert.equal(typeof pred, 'function');

});

test('pred should return true if wrapped pred returns true', (assert) => {

    assert.equal(custom(() => true, 'always true')(true), true);

});

test('pred should throw ValidationError with provided message if wrapped pred returns false', (assert) => {

    const pred = custom(() => false, 'always false');

    assert.equal(
        removeStackFromErr(toResult(() => pred('whatever'))[0]!),
        removeStackFromErr(new ValidationError({root: 'always false'})),
    );

});
