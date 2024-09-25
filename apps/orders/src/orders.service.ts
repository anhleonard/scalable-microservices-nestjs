import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { OrderStatus } from '@app/common/enum/order.enum';
import { ClientProxy, Ctx, RmqContext } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '@app/common/constants/constants';
import { UserDto } from '@app/common/dtos/user.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: UserDto) {
    const order = await this.ordersRepository.create({
      ...createOrderDto,
      userId: user?._id,
      orderDate: new Date(),
      status: OrderStatus.NEW,
    });

    try {
      this.paymentService
        .send('create_charge', {
          email: user?.email,
          amount: createOrderDto?.amount,
        })
        .subscribe(async (res) => {
          await this.ordersRepository.findOneAndUpdate(
            { _id: order?._id },
            {
              status: OrderStatus.PAYMENT_RECEIVED,
            },
          );
        });
    } catch (error) {
      await this.ordersRepository.findOneAndUpdate(
        { _id: order?._id },
        {
          status: OrderStatus.PAYMENT_FAIL,
        },
      );
      throw new BadRequestException(error);
    }
  }
}
