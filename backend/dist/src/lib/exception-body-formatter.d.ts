import { ArgumentsHost, HttpException } from '@nestjs/common';
export declare function exceptionBodyFormatter(host: ArgumentsHost, exception: HttpException): {
    message: string;
    status: number;
    fieldErrors: {
        [k: string]: string[];
    } | undefined;
};
