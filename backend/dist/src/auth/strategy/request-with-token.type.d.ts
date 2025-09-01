import { Request } from 'express';
export type RequestWithToken = Request & {
    token: string;
};
