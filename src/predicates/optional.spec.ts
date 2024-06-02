import {test} from 'hoare';
import {optional} from './optional';
import {string} from './string';

test('should return predidcate that wraps predicate', (assert) => {

    const pred = optional(string());

    assert.equal(pred('hi'), true, 'returns true for valid string');
    assert.equal(pred(undefined), true, 'returns true for undefined');

});
