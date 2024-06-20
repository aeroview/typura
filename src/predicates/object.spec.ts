import {test} from 'hoare';
import {object} from './object';
import {toResult} from '../lib/toResult';
import {ValidationError} from '..';
import {removeStackFromErr} from '../lib/removeStackFromErr';
import {number} from './number';
import {string} from './string';
import {optional} from './optional';

// eslint-disable-next-line max-lines-per-function
test('pred should return true if all predicates pass', (assert) => {

    // simple
    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(pred({
        name: 'John',
        age: 42,
    }), true);

    // nested
    const nestedPred = object({
        name: string(),
        age: number(),
        address: object({
            line1: string(),
            line2: optional(string()),
            city: string(),
            state: string({len: {min: 2, max: 2}}),
            zip: string({len: {min: 5, max: 5}}),
        }),
    });

    assert.equal(nestedPred({
        name: 'John',
        age: 42,
        address: {
            line1: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
        },
    }), true);

});

test('pred should throw ValidationError with both errors if both fail', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(
        removeStackFromErr(toResult(() => pred({
            name: 42,
            age: 'John',
        }))[0]!),
        removeStackFromErr(new ValidationError({
            name: 'must be a string',
            age: 'must be a number',
        }))
    );

});

test('pred should throw if non-object passed as schema', (assert) => {

    assert.equal(
        // @ts-ignore
        removeStackFromErr(toResult(() => object(Math.PI))[0]!),
        removeStackFromErr(new Error('invalid schema, must be object'))
    );

});

test('pred should throw if non-object passed to pred as value', (assert) => {

    const pred = object({
        name: string(),
        age: number(),
    });

    assert.equal(
        removeStackFromErr(toResult(() => pred(Math.PI))[0]!),
        removeStackFromErr(new ValidationError({
            root: 'must be an object with keys name, age',
        }))
    );

});

test('nested validation errors should contain key.subkey as key', (assert) => {

    const nestedPred = object({
        name: string(),
        age: number(),
        address: object({
            line1: string(),
            line2: optional(string()),
            city: string(),
            state: string({len: {min: 2, max: 2}}),
            zip: string({len: {min: 5, max: 5}}),
        }),
    });
    const [err] = toResult(() => nestedPred({
        name: 'John',
        age: 42,
        address: {
            line1: 5,
            state: 'IL',
            zip: '627041',
        },
    }));

    assert.equal(
        removeStackFromErr(err!),
        removeStackFromErr(new ValidationError({
            'address.line1': 'must be a string',
            'address.city': 'must be a string',
            'address.zip': 'must be at most 5 characters',
        }))
    );

});
