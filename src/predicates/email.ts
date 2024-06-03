import {Pred, ValidationError} from '..';

const tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const err = new ValidationError({root: 'must be a valid email address'});

/**
 * Validates an email address.
 * Taken from https://github.com/manishsaraan/email-validator/blob/master/index.js
 */
export function email(): Pred<string> {

    return (value: unknown): value is string => {

        if (typeof value !== 'string') throw err;

        const emailParts = value.split('@');

        if (emailParts.length !== 2) throw err;

        const account = emailParts[0];
        const address = emailParts[1];

        if (account.length > 64) throw err;
        else if (address.length > 255) throw err;

        const domainParts = address.split('.');

        if (domainParts.some((part) => part.length > 63)) throw err;
        if (!tester.test(value)) throw err;

        return true;

    };

}
