import {test} from 'hoare';
import {chain} from './chain';
import {ValidationError} from '..';
import {string} from './string';
import {custom} from './custom';
import {toResult} from '../lib/toResult';
import {removeStackFromErr} from '../lib/removeStackFromErr';

test('should return a predicate', (assert) => {

    const pred = chain();

    assert.equal(typeof pred, 'function');

});

test('pred should return true for empty chain', (assert) => {

    const pred = chain();

    assert.equal(pred('whatever'), true);

});

test('pred should return true if all predicates in chain return true', (assert) => {

    const pred = chain(
        string({len: {min: 5, max: 8}}),
        custom<string>((value: string) => value.includes('o'), 'must include letter o'),
    );

    assert.equal(pred('hello'), true);

});

// eslint-disable-next-line max-lines-per-function
test('pred should throw ValidationError if any predicates in chain throw', (assert) => {

    const pred = chain(
        string({len: {min: 5, max: 10}}),
        custom<string>((value: string) => value.includes('o'), 'must include letter o'),
    );

    // not a string
    const [errNotString] = toResult(() => pred(42));
    const expctedNotStringErr = new ValidationError({
        root: 'must be a string',
    });

    assert.equal(
        removeStackFromErr(errNotString!),
        removeStackFromErr(expctedNotStringErr),
        'must be a string'
    );

    // too short
    const [errTooShort] = toResult(() => pred('hi'));
    const expectedTooShortErr = new ValidationError({
        root: 'must be at least 5 characters',
    });

    assert.equal(
        removeStackFromErr(errTooShort!),
        removeStackFromErr(expectedTooShortErr),
        'too short'
    );

    // too long
    const [errTooLong] = toResult(() => pred('blasdfasdfasdf'));
    const expectedTooLongErr = new ValidationError({
        root: 'must be at most 10 characters',
    });

    assert.equal(
        removeStackFromErr(errTooLong!),
        removeStackFromErr(expectedTooLongErr),
        'too long'
    );

    // missing letter o
    const [errMissingO] = toResult(() => pred('greetings'));
    const expectedMissingOErr = new ValidationError({
        root: 'must include letter o',
    });

    assert.equal(
        removeStackFromErr(errMissingO!),
        removeStackFromErr(expectedMissingOErr),
        'missing letter o'
    );

});
