"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, context) => {
    try {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const gqlContext = ctx.getContext();
        const req = gqlContext.req;
        if (req.user) {
            return req.user;
        }
    }
    catch {
        const req = context.switchToHttp().getRequest();
        if (!req.user) {
            throw new Error('User not found. Did you forget to use the AuthGuard?');
        }
        return req.user;
    }
});
//# sourceMappingURL=current-user.decorator.js.map