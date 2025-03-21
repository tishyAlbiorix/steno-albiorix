import { Injectable } from '@nestjs/common';
import WebSocket from 'ws';

@Injectable()
export class DeepgramService {
  private dgSocket: WebSocket;

  connectToDeepgram(onTranscript: (text: string) => void) {
    this.dgSocket = new WebSocket('wss://api.deepgram.com/v1/listen?punctuate=true', {
      headers: {
        Authorization: process.env.DEEPGRAM_API_KEY, // <-- Replace this
      },
    });

    this.dgSocket.on('open', () => {
      console.log('[Deepgram] Connected');
    });

    this.dgSocket.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      const transcript = msg.channel?.alternatives?.[0]?.transcript;
      if (transcript && transcript.length > 0) {
        onTranscript(transcript); // :speech_balloon: Call your handler
      }
    });

    this.dgSocket.on('close', () => {
      console.log('[Deepgram] Connection closed');
    });

    this.dgSocket.on('error', (err) => {
      console.error('[Deepgram] Error:', err);
    });
  }

  sendAudio(audioBuffer: Buffer) {
    if (this.dgSocket?.readyState === WebSocket.OPEN) {
      this.dgSocket.send(audioBuffer);
    }
  }

  close() {
    this.dgSocket?.close();
  }
}