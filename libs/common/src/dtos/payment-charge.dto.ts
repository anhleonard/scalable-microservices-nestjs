import { IsEmail } from 'class-validator';
import { CreateChargeDto } from './create-charge.dto';

export class PaymentChargeDto extends CreateChargeDto {
  @IsEmail()
  email: string;
}
