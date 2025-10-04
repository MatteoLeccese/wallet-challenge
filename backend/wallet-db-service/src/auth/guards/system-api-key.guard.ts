import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SystemApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Extract the request object
    const request: Request = context.switchToHttp().getRequest();

    // Get the API key from the request headers
    const apiKeyHeader = request.headers['x-system-api-key'];

    // Ensure the expected API key is set in environment variables
    const expectedKey = process.env.SYSTEM_API_KEY;
    if (!expectedKey) {
      throw new Error('SYSTEM_API_KEY is not defined in environment');
    }

    // Validate the provided API key
    if (!apiKeyHeader || apiKeyHeader !== expectedKey) {
      throw new ForbiddenException('Invalid or missing system API key');
    }

    return true;
  }
}
