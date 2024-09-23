import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    trasport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_NT_PORT'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('NT_PORT'));
}
bootstrap();
