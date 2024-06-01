"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.Non200Response = void 0;
/* eslint-disable max-lines-per-function */
const invokeOrFail_1 = require("./lib/invokeOrFail");
const toResult_1 = __importDefault(require("./lib/toResult"));
class Non200Response extends Error {
    constructor(status, response) {
        super('Non200Response');
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = 'Non200Response';
        this.status = status;
        this.response = response;
    }
}
exports.Non200Response = Non200Response;
/**
 * We're purposely not putting any type alias for the client route to aid in better IDE intellisense.
 * Otherwise, the TS compiler/autocomplete might suggest the type alias instead of the underlying (initial) type.
*/
async function client(name, input, options) {
    const [err, resp] = await (0, toResult_1.default)(fetch(`${options?.endpoint}/${name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options?.fetchOptions?.headers,
        },
        body: JSON.stringify(input || {}),
        ...options?.fetchOptions,
    }));
    if (err) {
        options?.onError?.(err);
        // Re-throw the error so the promise rejects correctly
        throw err;
    }
    const data = await resp.text();
    let responseData;
    if (data.trim().length) {
        const [, result] = (0, invokeOrFail_1.invokeOrFail)(() => JSON.parse(data));
        responseData = result;
    }
    if (!resp.ok) {
        throw new Non200Response(resp.status, responseData);
    }
    return responseData;
}
exports.client = client;
//# sourceMappingURL=client.js.map