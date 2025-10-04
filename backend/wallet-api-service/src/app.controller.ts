import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { ProxyService } from './proxy/proxy.service';

@Controller()
export class AppController {
  constructor(private readonly proxyService: ProxyService) {}

  // Auth routes
  @Post('auth/register')
  register(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/auth/register',
      body,
      headers,
    );
  }

  @Post('auth/login')
  login(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/auth/login',
      body,
      headers,
    );
  }

  // Payments routes
  @Post('payments/initiate-payment')
  initiatePayment(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/payments/initiate-payment',
      body,
      headers,
    );
  }

  @Post('payments/confirm-payment')
  confirmPayment(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/payments/confirm-payment',
      body,
      headers,
    );
  }

  @Post('payments/initiate-purchase')
  initiatePurchase(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/payments/initiate-purchase',
      body,
      headers,
    );
  }

  @Post('payments/confirm-purchase')
  confirmPurchase(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/payments/confirm-purchase',
      body,
      headers,
    );
  }

  // Wallet routes
  @Post('wallets/top-up')
  topUp(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/wallets/top-up',
      body,
      headers,
    );
  }

  @Get('wallets/balance')
  getBalance(@Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'GET',
      '/wallets/balance',
      null,
      headers,
    );
  }

  @Post('wallets/balance/specific')
  getSpecificUserBalance(@Body() body: any, @Headers() headers: any) {
    return this.proxyService.forwardRequest(
      'POST',
      '/wallets/balance/specific',
      body,
      headers,
    );
  }
}
