import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  token: string;
}
