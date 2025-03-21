// src/websocket/audio.gateway.ts
import {
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import WebSocket from 'ws';
import { DeepgramService } from '../deepgram/deepgram.service';

@WebSocketGateway({ path: '/audio', transports: ['websocket'], cors: true })
export class AudioGateway implements OnGatewayConnection {
  buffer = Buffer.alloc(0);
  constructor(private deepgramService: DeepgramService) { }

  handleConnection(client: WebSocket) {
    console.log('[Twilio] Client connected');

    this.deepgramService.connect((text) => {
      // Do something with the transcribed text
      console.log('[User Said]', text);
      // Optionally send it to a bot or respond
    });

    // client.on('message', (data) => {
    //   const message = JSON.parse(data.toString());

    //   if (message.event === 'media') {
    //     const chunk = Buffer.from(message.media.payload, 'base64');
    //     this.buffer = Buffer.concat([this.buffer, chunk]);

    //     // Send every 10 chunks (~200ms)
    //     if (this.buffer.length >= 3200) {
    //       this.deepgramService.sendAudio(this.buffer);
    //       this.buffer = Buffer.alloc(0); // reset buffer
    //     }
    //   }
    // });
    client.on('message', (msg) => {
      const payload = JSON.parse(msg.toString());

      if (payload.event === 'media') {
        const audio = Buffer.from(payload.media.payload, 'base64');
        // console.log('[Twilio] Stream started',audio);

        this.deepgramService.sendAudio(audio);

      }

      if (payload.event === 'stop') {
        console.log('[Twilio] Stream stopped');
        // this.deepgramService.close();
      }
    });

    client.on('close', () => {
      console.log('[Twilio] WebSocket closed');
      // this.deepgramService.close();
    });
  }
}