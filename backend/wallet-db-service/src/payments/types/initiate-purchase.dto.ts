import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class InitiatePurchaseDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
