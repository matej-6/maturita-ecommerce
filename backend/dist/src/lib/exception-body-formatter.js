"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionBodyFormatter = exceptionBodyFormatter;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const nestjs_i18n_1 = require("nestjs-i18n");
const nestjs_i18n_2 = require("nestjs-i18n");
function exceptionBodyFormatter(host, exception) {
    const i18n = nestjs_i18n_2.I18nContext.current();
    let fieldErrors = undefined;
    if (exception instanceof nestjs_i18n_1.I18nValidationException) {
        console.log('here 3');
        fieldErrors = new Map();
        exception.message =
            i18n?.t('error.badRequest', {
                defaultValue: '',
            }) || '';
        exception.errors.forEach((e) => {
            const errors = new Map(e.constraints ? Object.entries(e.constraints) : []);
            fieldErrors.set(e.property, Array.from(errors.values()));
        });
    }
    else {
        const defaultMessage = 'An unknown error occurred';
        exception.message =
            i18n?.t(`error.${exception.message}`, {
                defaultValue: '',
            }) ||
                i18n?.t('error.unknownError', { defaultValue: '' }) ||
                defaultMessage;
    }
    const res = {
        message: exception.message,
        status: exception.getStatus(),
        fieldErrors: fieldErrors && Object.fromEntries(fieldErrors),
    };
    const gqlHost = graphql_1.GqlArgumentsHost.create(host);
    if (gqlHost.getContext() != null) {
        console.log('here 2');
        throw new graphql_2.GraphQLError(res.message, {
            extensions: {
                ...res,
            },
        });
    }
    return res;
}
//# sourceMappingURL=exception-body-formatter.js.map