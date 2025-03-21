// src/elevenlabs/elevenlabs.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ElevenLabsService {
  async textToSpeech(text: string): Promise<Buffer> {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech',
      { text },
      {
        headers: {
          Authorization: `Bearer ${process.env.ELEVENLABS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      },
    );
    return response.data;
  }
}
