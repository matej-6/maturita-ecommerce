import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/validate';
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
import {
  HeaderResolver,
  I18nModule,
  I18nValidationException,
} from 'nestjs-i18n';
import * as path from 'path';
import { AuthenticatedUserDto } from './auth/dto/authenticated-user.dto';
import { IDataLoaders } from './dataloader/dataloader.interface';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DEFAULT_LOCALE } from './locales';

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
          console.log('HEREEEE');
          console.log(error);
          return {
            message: error.message,
            code: error.extensions?.code,
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
    PrismaModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    JwtModule.register({}),
    RedisModule,
    LocalesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}

export type GraphqlAppContext = GraphQlContext & {
  user?: AuthenticatedUserDto;
  loaders: IDataLoaders;
};
