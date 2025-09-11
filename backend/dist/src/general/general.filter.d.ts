import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class GeneralFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
