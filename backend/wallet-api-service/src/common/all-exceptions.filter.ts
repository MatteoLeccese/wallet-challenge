// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const DEFAULT_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;
const DEFAULT_ERROR_MESSAGE = 'Internal server error';
const DEFAULT_ERROR_TYPE = 'Error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = DEFAULT_STATUS;
    let message: string = DEFAULT_ERROR_MESSAGE;
    let error: string = DEFAULT_ERROR_TYPE;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as Record<string, any>;
        if (Array.isArray(res.message)) {
          message = String(res.message[0]);
        } else if (typeof res.message === 'string') {
          message = res.message;
        } else {
          message = exception.message;
        }
        error = String(res.error ?? exception.name);
      } else {
        message = exception.message;
        error = exception.name;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      data: null,
    });
  }
}
