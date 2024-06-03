import {Pred, ValidationError} from '..';

export function password(): Pred<string> {

    return (password: unknown): password is string => {

        if (typeof password !== 'string') throw new ValidationError({
            root: 'must be a string',
        });

        const isWithinLength = password.length >= 8 && password.length <= 100;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!isWithinLength) throw new ValidationError({
            root: 'must between 8 and 100 characters',
        });
        if (!hasUppercase) throw new ValidationError({
            root: 'must include at least one uppercase letter',
        });
        if (!hasLowercase) throw new ValidationError({
            root: 'must include at least one lowercase letter',
        });
        if (!hasNumber) throw new ValidationError({
            root: 'must include at least one number',
        });
        if (!hasSpecialChar) throw new ValidationError({
            root: 'must include at least one special character',
        });

        return true;

    };

}
