import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private readonly http: HttpService) {}

  async forwardRequest<T>(
    method: 'GET' | 'POST',
    path: string,
    body: T,
    incomingHeaders: Record<string, string | string[] | undefined>,
  ): Promise<T> {
    // Load the Wallet DB URL from environment variables
    const walletDbUrl =
      process.env.WALLET_DB_URL ?? 'http://localhost:8000/api';

    // Load the System API Key from environment variables
    const systemApiKey = process.env.SYSTEM_API_KEY;

    if (!systemApiKey) {
      throw new Error('SYSTEM_API_KEY is not defined in environment');
    }

    // Filter out headers that should not be forwarded
    const {
      host: _host,
      'content-length': _cl,
      connection: _conn,
      ...safeHeaders
    } = incomingHeaders;

    // Adding the system API key to the headers
    const headers = AxiosHeaders.from({
      ...safeHeaders,
      'Content-Type': 'application/json',
      'x-system-api-key': systemApiKey,
    });

    // Forward the request to the Wallet DB service
    const response = await firstValueFrom(
      this.http
        .request<T>({
          method,
          url: `${walletDbUrl}${path}`,
          data: body,
          headers,
        })
        .pipe(timeout(2000)),
    );

    // Return the response data
    return response.data;
  }
}
