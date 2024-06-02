"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResult = void 0;
function toResult(executable) {
    try {
        const result = executable();
        return [undefined, result];
    }
    catch (e) {
        return [e];
    }
}
exports.toResult = toResult;
//# sourceMappingURL=toResult.js.map