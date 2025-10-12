import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exc: HttpException, host: ArgumentsHost): Record<string, unknown> | undefined;
}
