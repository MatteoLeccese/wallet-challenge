import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  document: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  names: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(5, 150)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;
}
