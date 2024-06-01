"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function toResult(p) {
    try {
        const result = await p;
        return [undefined, result];
    }
    catch (e) {
        return [e];
    }
}
exports.default = toResult;
//# sourceMappingURL=toResult.js.map