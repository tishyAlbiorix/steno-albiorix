import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio/twilio.service';
import { TwilioController } from './twilio/twilio.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TwilioController],
  providers: [TwilioService],
})
export class AppModule { }