import { DataloaderService } from './dataloader/dataloader.service';
import { GraphQlContext } from './types/graphql-context';
export declare class AppModule {
}
export type AppContext = GraphQlContext & {
    dataLoaderService: DataloaderService;
};
