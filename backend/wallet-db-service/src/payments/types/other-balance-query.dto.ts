import { IsNotEmpty, IsString, Length } from 'class-validator';

export class OtherBalanceQueryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  document: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  phone: string;
}
