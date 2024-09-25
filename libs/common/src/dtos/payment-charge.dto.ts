import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentChargeDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
