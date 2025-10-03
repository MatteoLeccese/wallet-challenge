import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: T) => {
        // If data is an object with a 'data' property, extract it
        const requestData: T = { ...data };

        // Default message
        let message: string = 'Success';

        if (
          requestData &&
          typeof requestData === 'object' &&
          'message' in requestData &&
          requestData.message
        ) {
          // Extract message if requestData is an object with message property
          message = requestData.message as string;
          // Remove message from requestData
          delete requestData.message;
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message,
          error: null,
          data: requestData ?? null,
        };
      }),
    );
  }
}
