import { ArgumentsHost, HttpException } from '@nestjs/common';
export declare function exceptionBodyFormatter(host: ArgumentsHost, exception: HttpException): Record<string, unknown>;
