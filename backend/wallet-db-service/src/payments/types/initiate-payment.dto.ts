import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class InitiatePaymentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  fromDocument: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  fromPhone: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  toDocument: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  toPhone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
