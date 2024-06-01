"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.Non200Response = void 0;
/* eslint-disable max-lines-per-function */
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
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
    const url = new url_1.URL(`${options?.endpoint}/${name}`);
    const requestOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options?.options?.headers,
        },
        protocol: url.protocol,
    };
    const [err, resp] = await (0, toResult_1.default)(httpRequestPromise(requestOptions, JSON.stringify(input || {})));
    if (err) {
        options?.onError?.(err);
        throw err;
    }
    const responseData = await new Promise((resolve, reject) => {
        let data = '';
        resp.on('data', (chunk) => data += chunk);
        resp.on('end', () => resolve(data));
        resp.on('error', reject);
    });
    let parsedData;
    if (responseData.trim().length) {
        const [, result] = (0, invokeOrFail_1.invokeOrFail)(() => JSON.parse(responseData));
        parsedData = result;
    }
    resp.statusCode = resp.statusCode || 0;
    if (resp.statusCode < 200 || resp.statusCode >= 300) {
        throw new Non200Response(resp.statusCode, parsedData);
    }
    return parsedData;
}
exports.client = client;
async function httpRequestPromise(options, body) {
    return new Promise((resolve, reject) => {
        const req = options.protocol === 'https:' ? https_1.default.request(options, resolve) : http_1.default.request(options, resolve);
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}
//# sourceMappingURL=client-node.js.map