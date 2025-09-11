"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const nestjs_i18n_1 = require("nestjs-i18n");
const all_exceptions_filter_1 = require("./all-exceptions/all-exceptions.filter");
const exception_body_formatter_1 = require("./lib/exception-body-formatter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.ORIGIN || [
            'http://localhost:3000',
            'googleusercontent.com',
        ],
        credentials: true,
    });
    app.use(cookieParser());
    app.use(nestjs_i18n_1.I18nMiddleware);
    app.useGlobalPipes(new nestjs_i18n_1.I18nValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(), new nestjs_i18n_1.I18nValidationExceptionFilter({
        detailedErrors: false,
        responseBodyFormatter(host, exc, formattedErrors) {
            return (0, exception_body_formatter_1.exceptionBodyFormatter)(host, exc);
        },
    }));
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map