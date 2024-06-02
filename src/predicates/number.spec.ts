import {test} from 'hoare';
import {number} from './number';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {removeStackFromErr} from '../lib/removeStackFromErr';

test('should return a predicate', (assert) => {

    const pred = number();

    assert.equal(typeof pred, 'function');

});

test('should return true for valid numbers', (assert) => {

    const pred = number();

    assert.equal(pred(42), true);

});

test('should throw ValidationError for non-numbers', (assert) => {

    const pred = number();

    assert.equal(
        removeStackFromErr(toResult(() => pred('42'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be a number',
        }))
    );

});


test('should return true if number inside range', (assert) => {

    const pred = number({range: {min: 5, max: 8}});

    assert.equal(pred(7), true);

});

test('should throw ValidationError if outside range', (assert) => {

    const pred = number({range: {min: 5, max: 8}});

    assert.equal(
        removeStackFromErr(toResult(() => pred(0))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be between 5 and 8',
        }))
    );

});

test('should throw ValidationError if too large', (assert) => {

    const pred = number({range: {min: 5, max: 8}});

    assert.equal(
        removeStackFromErr(toResult(() => pred(12312))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be between 5 and 8',
        }))
    );

});

