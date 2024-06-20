import {test} from 'hoare';
import {uuid} from './uuid';
import {removeStackFromErr} from '../lib/removeStackFromErr';
import {ValidationError} from '..';
import {toResult} from '../lib/toResult';

test('pred should return true if value is a valid uuid', (assert) => {

    const pred = uuid();

    assert.equal(pred('323b360f-4271-45ec-88f8-aaacda4e07c8'), true, '323b360f-4271-45ec-88f8-aaacda4e07c8');
    assert.equal(pred('806f0d3d-3a7b-45c0-9fac-8290d4eee792'), true, '806f0d3d-3a7b-45c0-9fac-8290d4eee792');
    assert.equal(pred('f87475ac-ed47-4db1-b725-1711523bf71e'), true, 'f87475ac-ed47-4db1-b725-1711523bf71e');

    // uuid examples from https://www.uuidtools.com/generate/v4

});

test('pred should throw ValidationError for invalid value', (assert) => {

    const pred = uuid();
    const expectedErr = removeStackFromErr(new ValidationError({
        root: 'must be a valid uuid',
    }));

    assert.equal(removeStackFromErr(toResult(() => pred('aefadsfasdfasdf'))[0]!), expectedErr);
    assert.equal(removeStackFromErr(toResult(() => pred(42))[0]!), expectedErr);

});
