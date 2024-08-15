import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { exceptionResponseType } from './types/exception.response.type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.NOT_FOUND) {
      const errorsResponse: exceptionResponseType = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();

      if (
        status === HttpStatus.BAD_REQUEST ||
        status === HttpStatus.NOT_FOUND
      ) {
        if (typeof responseBody.message === 'string') {
          errorsResponse.errorsMessages.push(responseBody.message);
        } else if (Array.isArray(responseBody.message)) {
          responseBody.message.forEach((m: any) =>
            errorsResponse.errorsMessages.push(m),
          );
        }

        return response.status(status).json(errorsResponse);
      } else {
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }
    }
  }
}
