import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// Define constants for default values to avoid magic numbers or strings
const DEFAULT_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;
const DEFAULT_ERROR_MESSAGE = 'Internal server error';
const DEFAULT_ERROR_TYPE = 'Error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Extract the HTTP context from the host to access the response object
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Initialize default values for status, message, and error
    let status = DEFAULT_STATUS;
    let message: string = DEFAULT_ERROR_MESSAGE;
    let error: string = DEFAULT_ERROR_TYPE;

    // Check if the exception is an instance of HttpException
    if (exception instanceof HttpException) {
      // Extract the HTTP status code from the exception
      status = exception.getStatus();
      // Get the response payload from the exception
      const exceptionResponse = exception.getResponse();

      // If the response is a simple string, use it as the message
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      }
      // If the response is an object, try to extract message and error fields
      else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as Record<string, any>;

        // If message is an array (validation errors), take the first element
        if (Array.isArray(res.message)) {
          message = String(res.message[0]);
        }
        // If message is a string, use it directly
        else if (typeof res.message === 'string') {
          message = res.message;
        }
        // Fallback to the exception's own message
        else {
          message = exception.message;
        }

        // Set the error field, defaulting to the exception name if not provided
        error = String(res.error ?? exception.name);
      }
      // If the response is neither string nor object, fallback to exception.message
      else {
        message = exception.message;
        error = exception.name;
      }
    }

    // Send the standardized JSON response with status, message, error, and null data
    response.status(status).json({
      statusCode: status,
      message,
      error,
      data: null,
    });
  }
}
