import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './types/initiate-payment.dto';
import { ConfirmPaymentDto } from './types/confirm-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate-payment')
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(dto);
  }

  @Post('confirm-payment')
  confirm(@Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(dto);
  }
}
