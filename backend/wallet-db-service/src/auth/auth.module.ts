import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    ClientsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'your_jwt_secret_key',
      signOptions: {
        expiresIn: `${process.env.JWT_EXPIRES_IN_SECONDS ?? '3600'}s`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
