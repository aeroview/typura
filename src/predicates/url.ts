import {Pred, ValidationError} from '..';

const regexWithoutLocalhost = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?(#\S*)?$/;
const regexWithLocalhost = /^(http|https):\/\/((([\w-]+\.)+[\w-]+)|(localhost))(:\d+)?(\/[\w-./?%&=]*)?(#\S*)?$/;

export function url(options?: {
    allowLocalhost?: boolean
}): Pred<string> {

    return (value: unknown): value is string => {

        if (typeof value !== 'string') {

            throw new ValidationError({root: 'must be a valid URL'});

        }

        const tester = options?.allowLocalhost ? regexWithLocalhost : regexWithoutLocalhost;


        if (tester.test(value)) {

            return true;

        } else {

            throw new ValidationError({root: 'must be a valid URL'});


        }

    };

}
