import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { TopUpWalletDto } from './interfaces/topup-wallet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaymentsService } from 'src/payments/payments.service';
import { type CurrentUserData } from 'src/auth/interfaces/current-user.interface';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('top-up')
  async topUp(@Body() dto: TopUpWalletDto) {
    return this.walletsService.topUp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  getBalance(@CurrentUser() user: CurrentUserData) {
    return this.paymentsService.getBalance(user.userId);
  }
}
