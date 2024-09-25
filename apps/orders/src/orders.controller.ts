import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { UserDto } from '@app/common/dtos/user.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.ordersService.createOrder(createOrderDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async getOrders() {
    return 'this is all orders for you.';
  }
}
