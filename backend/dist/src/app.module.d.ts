import { DataloaderService } from './dataloader/dataloader.service';
import { GraphQlContext } from './types/graphql-context';
import { AuthenticatedUserDto } from './auth/dto/authenticated-user.dto';
export declare class AppModule {
}
export type GraphqlAppContext = GraphQlContext & {
    user?: AuthenticatedUserDto;
    dataLoaderService: DataloaderService;
};
