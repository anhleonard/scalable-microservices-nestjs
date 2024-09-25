import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'orders',
    },
  });
  await app.startAllMicroservices();

  await app.listen(configService.get('ORDER_PORT'));
}
bootstrap();
