"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const validate_1 = require("./config/validate");
const prisma_service_1 = require("./prisma/prisma.service");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const dataloader_service_1 = require("./dataloader/dataloader.service");
const prisma_module_1 = require("./prisma/prisma.module");
const categories_module_1 = require("./categories/categories.module");
const users_module_1 = require("./users/users.module");
const auth_service_1 = require("./auth/auth.service");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const redis_module_1 = require("./redis/redis.module");
const locales_module_1 = require("./locales/locales.module");
const nestjs_i18n_1 = require("nestjs-i18n");
const path = require("path");
const dataloader_module_1 = require("./dataloader/dataloader.module");
const locales_1 = require("./locales");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: locales_1.DEFAULT_LOCALE.code,
                loaderOptions: {
                    path: path.join(__dirname, '/i18n/'),
                    watch: true,
                },
                typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
                resolvers: [new nestjs_i18n_1.HeaderResolver(['x-custom-lang'])],
            }),
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                imports: [prisma_module_1.PrismaModule, dataloader_module_1.DataloaderModule],
                inject: [prisma_service_1.PrismaService, dataloader_service_1.DataloaderService],
                useFactory: (db, dataLoaderService) => ({
                    hideSchemaDetailsFromClientErrors: true,
                    formatError: (error) => {
                        return {
                            message: error.message,
                            extensions: {
                                statusCode: error.extensions?.statusCode,
                                errors: error.extensions?.errors,
                            },
                        };
                    },
                    fieldResolverEnhancers: ['interceptors', 'guards'],
                    graphiql: true,
                    autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
                    sortSchema: true,
                    context: ({ req, res }) => {
                        return {
                            loaders: dataLoaderService.getLoaders(),
                            req,
                            res,
                        };
                    },
                }),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.production', '.env.development', '.env'],
                validate: validate_1.validateEnv,
            }),
            prisma_module_1.PrismaModule,
            categories_module_1.CategoriesModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({}),
            redis_module_1.RedisModule,
            locales_module_1.LocalesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, auth_service_1.AuthService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map