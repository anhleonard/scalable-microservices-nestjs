import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentChargeDto } from '@app/common/dtos/payment-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  async createCharge(@Payload() data: PaymentChargeDto) {
    console.log('anh is the best');
    console.log({ data });
    return await this.paymentsService.createCharge(data);
  }

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
}
