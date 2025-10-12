"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const nestjs_i18n_1 = require("nestjs-i18n");
const all_exceptions_filter_1 = require("./all-exceptions/all-exceptions.filter");
const validation_filter_1 = require("./validation/validation.filter");
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
        transform: true,
        validateCustomDecorators: true,
        enableDebugMessages: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(), new validation_filter_1.ValidationFilter(), new nestjs_i18n_1.I18nValidationExceptionFilter({
        detailedErrors: false,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map