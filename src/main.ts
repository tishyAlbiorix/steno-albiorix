import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { WsAdapter } from '@nestjs/platform-ws';
dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app)); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
