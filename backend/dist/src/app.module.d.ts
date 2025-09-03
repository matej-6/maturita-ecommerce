import { DataloaderService } from './dataloader/dataloader.service';
import { GraphQlContext } from './types/graphql-context';
export declare class AppModule {
}
export type GraphqlAppContext = GraphQlContext & {
    dataLoaderService: DataloaderService;
};
