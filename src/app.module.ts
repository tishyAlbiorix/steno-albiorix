import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioController } from './twilio/twilio.controller';
import { TwilioService } from './twilio/twilio.service';
import { AudioGateway } from './websocket/websocket.gateway';
import { DeepgramService } from './deepgram/deepgram.service';

@Module({
  imports: [],
  controllers: [AppController, TwilioController],
  providers: [AppService, TwilioService,AudioGateway, DeepgramService],
})
export class AppModule {}
