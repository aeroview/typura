"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPI = void 0;
function createAction(router, name, resolver, contextResolver) {
    router.post(`/${name}`, async (req, res, next) => {
        try {
            const context = contextResolver ? await contextResolver(req) : {};
            const response = await resolver(req.body, context);
            res.json(response);
        }
        catch (e) {
            next(e);
        }
    });
}
function createAPI(router, api, contextResolver) {
    Object.keys(api).forEach((key) => createAction(router, key, api[key], contextResolver));
}
exports.createAPI = createAPI;
//# sourceMappingURL=server.js.map