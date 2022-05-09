import {
  HttpExceptionResponse,
  CustomHttpExceptionResponse,
} from './models/exception-response.interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      errorMessage =
        (errorResponse as HttpExceptionResponse).message || exception.message;
    } else {
      (status = HttpStatus.INTERNAL_SERVER_ERROR),
        (errorMessage = 'Critical internal server error occurred!');
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);

    const errorLog = this.getErrorLog(errorResponse, request, exception);

    this.writeErrorLogToFile(errorLog);

    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    message: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, message } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
    ${JSON.stringify(errorResponse)}
    User: ${JSON.stringify(request.user ?? 'Not Signed in')}\n\n${
      exception instanceof HttpException ? exception.stack : message
    }\n\n`;

    return errorLog;
  };

  // error.log
  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, `utf8`, (err) => {
      if (err) throw err;
    });
  };
}
