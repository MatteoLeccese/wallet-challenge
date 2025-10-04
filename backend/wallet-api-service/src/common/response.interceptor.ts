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
        const requestData: T = { ...data };
        let message: string = 'Success';

        if (
          requestData &&
          typeof requestData === 'object' &&
          'message' in requestData &&
          requestData.message
        ) {
          message = requestData.message as string;
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
