import { DataloaderService } from './dataloader/dataloader.service';
import { Request, Response } from 'express';
export declare class AppModule {
}
export type AppContext = {
    dataLoaderService: DataloaderService;
    req: Request;
    res: Response;
};
