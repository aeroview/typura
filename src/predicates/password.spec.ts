import {test} from 'hoare';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {removeStackFromErr} from '../lib/removeStackFromErr';
import {password} from './password';

test('should return a predicate', (assert) => {

    const pred = password();

    assert.equal(typeof pred, 'function');

});

test('pred should return true for valid passwords', (assert) => {

    const pred = password();

    assert.equal(pred('asldh#2N'), true);
    assert.equal(pred('423Ab_$2s'), true);

});

// eslint-disable-next-line max-lines-per-function
test('pred should throw ValidationError for invalid password', (assert) => {

    const pred = password();

    assert.equal(
        removeStackFromErr(toResult(() => pred(42))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be a string',
        })),
        'not a string'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred(true))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be a string',
        })),
        'not a string'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('asdf'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must between 8 and 100 characters',
        })),
        'too short'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('blahblahblah'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must include at least one uppercase letter',
        })),
        'no uppercase'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('BLAHBLAHBLAH'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must include at least one lowercase letter',
        })),
        'no lowercase'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('asdfASDF$'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must include at least one number',
        })),
        'no number'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('Aa45245bhAd'))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must include at least one special character',
        })),
        'no special char'
    );

});
