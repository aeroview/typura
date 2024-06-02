export function removeStackFromErr(err: Error): object {

    const newErr = errorToObject(err);

    delete newErr.stack;

    return newErr;

}

function errorToObject(error: Error): Record<string, any> {

    const plainObject: Record<string, any> = {};

    // Get all property names, including non-enumerable ones
    const propertyNames = Object.getOwnPropertyNames(error);

    for (const name of propertyNames) {

        plainObject[name] = (error as any)[name];

    }

    return plainObject;

}
