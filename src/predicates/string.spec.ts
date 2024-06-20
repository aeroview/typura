import {test} from 'hoare';
import {string} from './string';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {removeStackFromErr} from '../lib/removeStackFromErr';

test('should return true for valid strings', (assert) => {

    const pred = string();

    assert.equal(pred('hello'), true);

});

test('should throw ValidationError for invalid strings', (assert) => {

    const pred = string();

    assert.equal(
        removeStackFromErr(toResult(() => pred(42))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be a string',
        }))
    );

});

test('should return true for empty strings', (assert) => {

    const pred = string();

    assert.equal(pred(''), true);

});

test('should return true if inside length range', (assert) => {

    const pred = string({len: {min: 5, max: 8}});

    assert.equal(pred('hello'), true);

});

test('should throw ValidationError if too small', (assert) => {

    const pred = string({len: {min: 5, max: 8}});

    assert.equal(
        removeStackFromErr(toResult(() => pred('hi'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be at least 5 characters',
        }))
    );

});

test('should throw ValidationError if too large', (assert) => {

    const pred = string({len: {min: 5, max: 8}});

    assert.equal(
        removeStackFromErr(toResult(() => pred('saldkfjlaskjdflaskdfasdf'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be at most 8 characters',
        }))
    );

});

