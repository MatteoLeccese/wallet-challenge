import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './types/initiate-payment.dto';
import { ConfirmPaymentDto } from './types/confirm-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type CurrentUserData } from 'src/auth/interfaces/current-user.interface';
import { InitiatePurchaseDto } from './types/initiate-purchase.dto';
import { ConfirmPurchaseDto } from './types/confirm-purchase.dto';
import { SystemApiKeyGuard } from 'src/auth/guards/system-api-key.guard';

@UseGuards(SystemApiKeyGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate-payment')
  initiate(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm-payment')
  confirm(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmPayment(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('initiate-purchase')
  initiatePurchase(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: InitiatePurchaseDto,
  ) {
    return this.paymentsService.initiatePurchase(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm-purchase')
  confirmPurchase(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ConfirmPurchaseDto,
  ) {
    return this.paymentsService.confirmPurchase(user.userId, dto);
  }
}
