"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeOrFail = void 0;
function invokeOrFail(executable) {
    try {
        const result = executable();
        return [undefined, result];
    }
    catch (e) {
        return [e];
    }
}
exports.invokeOrFail = invokeOrFail;
//# sourceMappingURL=invokeOrFail.js.map