import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), WalletsModule],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
