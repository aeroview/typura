import {test} from 'hoare';
import {array} from './array';
import {number} from './number';
import {Pred, ValidationError} from '..';
import {custom} from './custom';

test('pred should return true for arrays', (assert) => {

    const pred = array(number());

    assert.equal(pred([]), true);
    assert.equal(pred([1, 2, 3]), true);

});

test('pred should throw ValidationError for invalid value', (assert) => {

    assert.throws(() => array(number())(42), new ValidationError({root: 'must be an array'}), 'throws');
    assert.throws(() => array(number())([1, '2', 3]), new ValidationError({'[1]': 'must be a number'}), 'throws');
    assert.throws(
        () => array(custom(() => false, 'I like nothing'))([1, '2', 3]),
        new ValidationError({
            '[0]': 'I like nothing',
            '[1]': 'I like nothing',
            '[2]': 'I like nothing',
        }),
        'throws'
    );

    const predWithInvalidError: Pred<number> = (val: unknown): val is number => {

        if (typeof val !== 'number') throw new Error('must be a number');
        return true;

    };

    assert.throws(
        () => array(predWithInvalidError)([1, '2', 3]),
        new Error('must be a number'),
        'throws'
    );

});
