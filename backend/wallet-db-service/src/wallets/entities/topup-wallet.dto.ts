import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class TopUpWalletDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  document: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
