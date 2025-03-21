import { Controller, Post, Body, Get, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { TwilioService } from './twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) { }

  @Post('call')
  async makeCall(@Body() body: { to: string; message: string }) {
    return this.twilioService.createCall(body.to);
  }

  @Post('transcription')
  handleTranscription(@Body() body: any) {
    console.log('Transcription Received:', body);
    return { message: 'Transcription received', data: body };
  }

  @Get('voice-response')
  @Post('voice-response')
  voiceResponse(@Req() req: Request, @Res() res: Response) {
    console.log(`Received ${req.method} request at /twilio/voice-response`);
    const twiml = `
      <Response>
        <Say> Hello! This call will be recorded for transcription. Please speak after the beep.</Say>
        <Record maxLength="30" transcribe="true" transcribeCallback="https://c8ba-103-250-137-144.ngrok-free.app/twilio/transcription"/>
        <Say>Thank you. Goodbye!</Say>
      </Response>
    `;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(twiml);
  }
}
