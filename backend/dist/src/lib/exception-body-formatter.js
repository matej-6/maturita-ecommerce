"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionBodyFormatter = exceptionBodyFormatter;
const nestjs_i18n_1 = require("nestjs-i18n");
function exceptionBodyFormatter(host, exception) {
    let fieldErrors = new Map();
    if (exception instanceof nestjs_i18n_1.I18nValidationException) {
        exception.errors.forEach((e) => {
            const errors = e.constraints;
            fieldErrors.set(e.property, errors);
        });
    }
    console.log('field Errors: ', fieldErrors);
    return {
        message: exception.message,
        status: exception.getStatus(),
    };
}
//# sourceMappingURL=exception-body-formatter.js.map