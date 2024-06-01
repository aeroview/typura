"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hoare_1 = require("hoare");
const express_1 = require("express");
const server_1 = require("./server");
const client_1 = require("./client");
const apiRouter = (0, express_1.Router)();
(0, hoare_1.test)('should compile without errors', (assert) => {
    // Unfortunately, there is no easy way to see if there IS a compiler error and have the
    // test pass ^_^
    const api = {
        hello: (noun) => Promise.resolve(`hello, ${noun}!`),
        sum: (operands) => operands.reduce((sum, num) => sum + num, 0),
    };
    (0, server_1.createAPI)(apiRouter, api);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hello = () => (0, client_1.client)('hello', 'world');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sum = () => (0, client_1.client)('sum', [1, 2, 3]);
    assert.equal(true, true, 'no TS compiler errors :)');
});
//# sourceMappingURL=typecheck.spec.js.map