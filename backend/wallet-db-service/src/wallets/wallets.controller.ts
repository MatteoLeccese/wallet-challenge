import { Body, Controller, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { TopUpWalletDto } from './interfaces/topup-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('top-up')
  async topUp(@Body() dto: TopUpWalletDto) {
    return this.walletsService.topUp(dto);
  }
}
