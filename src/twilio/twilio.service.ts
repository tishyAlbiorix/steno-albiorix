import { Get, Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { Response } from 'express';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.client = Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async createCall(to: string) {
    const call = await this.client.calls.create({
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER') || "+12695576450",
      to,
      // twiml: "<Response><Say>Ahoy, World!</Say></Response>",
      url: 'https://c8ba-103-250-137-144.ngrok-free.app/twilio/voice-response', // Custom TwiML URL
      record: true,
    });

    console.log(call.sid);
    return { callSid: call.sid };
  }
}
