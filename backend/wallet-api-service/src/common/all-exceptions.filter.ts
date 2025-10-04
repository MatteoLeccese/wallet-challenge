import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';

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
    } else if (exception instanceof AxiosError) {
      status = exception.response?.status ?? DEFAULT_STATUS;
      const data = exception.response?.data;
      if (data) {
        status = data.statusCode ?? status;
        message = data.message ?? DEFAULT_ERROR_MESSAGE;
        error = data.error ?? 'UpstreamError';
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception && typeof exception === 'object') {
      const err = exception as any;
      status = err.status ?? err.response?.status ?? DEFAULT_STATUS;
      message =
        err.response?.data?.message ?? err.message ?? DEFAULT_ERROR_MESSAGE;
      error = err.response?.data?.error ?? err.name ?? DEFAULT_ERROR_TYPE;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      data: null,
    });
  }
}
