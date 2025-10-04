import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class ConfirmPurchaseDto {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  token: string;
}
