// src/twilio/twilio.service.ts
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async initiateWebRTCCall(to:string) {
    return this.client.calls.create({
      url: `https://cac8-223-182-181-68.ngrok-free.app/twilio/voice-response`,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to: to, // Call itself for WebRTC session
    });
  }

  // src/twilio/twilio.service.ts
  async sendAudioToTwilio(callSid: string, audioBuffer: Buffer) {
    await this.client.calls(callSid).update({
      twiml: `<Response><Play>${audioBuffer.toString('base64')}</Play></Response>`,
    });
  }
}
