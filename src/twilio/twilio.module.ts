import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { TwilioController } from './twilio.controller';

@Module({
  providers: [TwilioService],  // Register Twilio service
  controllers: [TwilioController],  // Register Twilio controller
  exports: [TwilioService],  // Make service available outside
})
export class TwilioModule { }  // Declare the module
