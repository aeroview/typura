import {test} from 'hoare';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {removeStackFromErr} from '../lib/removeStackFromErr';
import {enumValue} from './enumValue';

enum TestEnum {
    foo = 'foo',
    bar = 'bar',
    baz = 'baz'
}
const expectedErr = removeStackFromErr(new ValidationError({
    root: 'must be a valid enum value',
}));

test('pred should return true if value is a valid value of the enum', (assert) => {

    const pred = enumValue(TestEnum);

    assert.equal(pred('foo'), true, 'foo');
    assert.equal(pred('bar'), true, 'bar');
    assert.equal(pred('baz'), true, 'baz');

});

test('pred should throw ValidationError for invalid value', (assert) => {

    const pred = enumValue(TestEnum);

    assert.equal(removeStackFromErr(toResult(() => pred('gak'))[0]!), expectedErr, 'gak');
    assert.equal(removeStackFromErr(toResult(() => pred('blah'))[0]!), expectedErr, 'blah');

});

