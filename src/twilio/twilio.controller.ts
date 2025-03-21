// src/twilio/twilio.controller.ts
import { All, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { Response } from 'express';
import * as Twilio from 'twilio';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('call')
  async makeCall() {
    console.log('in call');
    return this.twilioService.initiateWebRTCCall('+917874930511');
  }
  @All('voice-response')
  voiceResponse(@Req() req: Request, @Res() res: Response) {
    console.log(`Received ${req.method} request at /twilio/voice-response`);
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say('Hello! This call will be recorded for transcription. Please speak after the beep.');
    
    const connect = twiml.connect();
    console.log('connect', connect);
    
    connect.stream({
      url: 'wss://cac8-223-182-181-68.ngrok-free.app/audio' 
    });
    console.log("After stream connect");
    
    res.type('text/xml');
    // res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(twiml.toString());
  }
  @Post('voice')
  async handleVoice(@Res() res: Response) {
    console.log('in voice');
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.connect().stream({ url: 'wss://localhost:3000/websocket' });
    res.type('text/xml').send(twiml.toString());
  }  
}
