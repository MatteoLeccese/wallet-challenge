import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from 'src/clients/interfaces/create-customer.dto';
import { LoginDto } from './interfaces/login.dto';
import { SystemApiKeyGuard } from './guards/system-api-key.guard';

@UseGuards(SystemApiKeyGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateCustomerDto) {
    // Call the auth service to handle registration
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
