import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, ProxyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
