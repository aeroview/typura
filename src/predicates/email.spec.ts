import {test} from 'hoare';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {removeStackFromErr} from '../lib/removeStackFromErr';
import {email} from './email';

test('should return a predicate', (assert) => {

    const pred = email();

    assert.equal(typeof pred, 'function');

});

test('pred should return true for valid emails', (assert) => {

    const pred = email();

    assert.equal(pred('john.doe@example.com'), true, 'email with dot');
    assert.equal(pred('john.doe+test123@example.com'), true, 'email with plus');
    assert.equal(pred('jane-doe@sub.example.co.uk'), true, 'with dash and subdomain');
    assert.equal(pred('user.name@example.io'), true, 'user.name@example.io');

});

// eslint-disable-next-line max-lines-per-function
test('pred should throw ValidationError for invalid emails', (assert) => {

    const pred = email();
    const expectedErr = removeStackFromErr(new ValidationError({
        root: 'must be a valid email address',
    }));

    assert.equal(
        removeStackFromErr(toResult(() => pred(42))[0]!),
        expectedErr,
        'not a string'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred(true))[0]!),
        expectedErr,
        'not a string'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('plainaddress'))[0]!),
        expectedErr,
        'plainaddress'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('@missingusername.com'))[0]!),
        expectedErr,
        'missing user name'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('username@.com'))[0]!),
        expectedErr,
        'missing domain'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('username@.com.'))[0]!),
        expectedErr,
        'period at end'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('username@domain..com'))[0]!),
        expectedErr,
        'double period'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('username@domain@domain.com'))[0]!),
        expectedErr,
        'double @'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('.username@domain.com'))[0]!),
        expectedErr,
        'period at start'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('username@domain,com'))[0]!),
        expectedErr,
        'comma instead of period'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('usersdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfname@domain.com'))[0]!),
        expectedErr,
        'too long username'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('user@domainnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.com'))[0]!),
        expectedErr,
        'too long account'
    );
    assert.equal(
        removeStackFromErr(toResult(() => pred('user@domainnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm'))[0]!),
        expectedErr,
        'too long address'
    );

});
