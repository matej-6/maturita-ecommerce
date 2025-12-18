import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env, validateEnv } from './config/validate';
import { PrismaService } from './prisma/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataloaderService } from './dataloader/dataloader.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { Request, Response } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { GraphQlContext } from './types/graphql-context';
import { RedisModule } from './redis/redis.module';
import { LocalesModule } from './locales/locales.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AuthenticatedUserDto } from './auth/dto/authenticated-user.dto';
import { IDataLoaders } from './dataloader/dataloader.interface';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DEFAULT_LOCALE } from './locales';
import { ProductsModule } from './products/products.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { ProductVariantAttributesModule } from './product-variant-attributes/product-variant-attributes.module';
import { ProductVariantAttributeKeysModule } from './product-variant-attribute-keys/product-variant-attribute-keys.module';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { TaskService } from './tasks/task.service';
import { TasksModule } from './tasks/tasks.module';
import { LLMPromptsModule } from './llm-prompts/llm-prompts.module';
import { BullModule } from '@nestjs/bullmq';
import { ConsumersModule } from './consumers/consumers.module';
import { LlmModule } from './llm/llm.module';
import { QdrantModule } from './qdrant/qdrant.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LOCALE.code,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [PrismaModule, DataloaderModule],
      inject: [PrismaService, DataloaderService],
      useFactory: (
        db: PrismaService,
        dataLoaderService: DataloaderService,
      ) => ({
        hideSchemaDetailsFromClientErrors: true,
        formatError: (error) => {
          console.log(error);
          return {
            message: error.message,
            extensions: {
              statusCode:
                error.extensions?.statusCode ||
                (error.extensions?.originalError as { statusCode?: number })
                  ?.statusCode ||
                500,
              errors: error.extensions?.errors,
            },
          };
        },
        fieldResolverEnhancers: ['interceptors', 'guards'], // aby som mohol pouzivat @UseGuards() aj nad fieldResolvers
        graphiql: true,
        autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        context: ({ req, res }: { req: Request; res: Response }) => {
          return {
            loaders: dataLoaderService.getLoaders(),
            req,
            res,
          } as GraphqlAppContext;
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env.development', '.env'],
      validate: validateEnv,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService<Env>) {
        return {
          connection: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
          },
        };
      },
    }),
    PrismaModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    JwtModule.register({}),
    RedisModule,
    LocalesModule,
    ProductsModule,
    ProductVariantsModule,
    ProductVariantAttributesModule,
    ProductVariantAttributeKeysModule,
    CartsModule,
    CartItemsModule,
    OrdersModule,
    TasksModule,
    LLMPromptsModule,
    ConsumersModule,
    LlmModule,
    QdrantModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, TaskService],
})
export class AppModule {}

export type GraphqlAppContext = GraphQlContext & {
  user?: AuthenticatedUserDto;
  loaders: IDataLoaders;
};
