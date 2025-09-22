import { GraphQlContext } from './types/graphql-context';
import { AuthenticatedUserDto } from './auth/dto/authenticated-user.dto';
import { IDataLoaders } from './dataloader/dataloader.interface';
export declare class AppModule {
}
export type GraphqlAppContext = GraphQlContext & {
    user?: AuthenticatedUserDto;
    loaders: IDataLoaders;
};
