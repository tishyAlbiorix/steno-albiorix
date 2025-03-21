import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class DeepgramService {
  private deepgramSocket: WebSocket;
  private isConnected = false;

  connect(onTranscript: (text: string, isFinal: boolean) => void) {
    const deepgramUrl = `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&punctuate=true&model=nova-2&interim_results=false&language=en`; // Added query parameters

    this.deepgramSocket = new WebSocket(deepgramUrl, {
      headers: {
        Authorization: 'Token ' + process.env.DEEPGRAM_API_KEY,
        'Content-Type': 'audio/linear16',
      },
    });

    this.deepgramSocket.on('open', () => {
      console.log('[Deepgram] Connected');
      this.isConnected = true;
    });

    this.deepgramSocket.on('message', (msg: WebSocket.Data) => {
      console.log('[Deepgram] Raw response:', msg.toString());
      try {
        const json = JSON.parse(msg.toString());
        console.log("[Deepgram] Full Response:", JSON.stringify(json, null, 2));

        const alternatives = json.channel?.alternatives;
        if (alternatives && alternatives.length > 0) {
          const transcript = alternatives[0]?.transcript || "";
          const confidence = alternatives[0]?.confidence || 0;

          console.log("[Deepgram] Transcript:", transcript);
          console.log("[Deepgram] Confidence:", confidence);

          if (transcript.length > 0) {
            onTranscript(transcript, json.is_final);
          } else {
            console.warn("[Deepgram] No words detected in audio.");
          }
        } else {
          console.warn("[Deepgram] No alternatives found in response.");
        }
      } catch (err) {
        console.error("[Deepgram] Failed to parse message:", err);
      }
    });

    this.deepgramSocket.on('error', (err) => {
      console.error('[Deepgram] WebSocket error:', err.message);
    });

    this.deepgramSocket.on('close', () => {
      console.log('[Deepgram] Connection closed');
      this.isConnected = false;
    });
  }

  // sendAudio(audioBuffer: Buffer) {
  //   if (this.isConnected) {
  //     // console.log('audioBuffer', audioBuffer);
  //     this.deepgramSocket.send(audioBuffer);
  //   }
  // }

  sendAudio(audioBuffer: Buffer) {
    if (this.isConnected) {
      // console.log("[Deepgram] Raw Audio Buffer Size:", audioBuffer.length, "bytes");

      const pcmAudio = this.mulawToPCM(audioBuffer);
      // console.log("[Deepgram] Converted PCM Audio Size:", pcmAudio.length, "bytes");

      this.deepgramSocket.send(pcmAudio);
    } else {
      console.warn("[Deepgram] Tried to send audio but WebSocket is not connected.");
    }
  }


  close() {
    if (this.deepgramSocket) {
      this.deepgramSocket.close();
    }
    this.isConnected = false;
  }

  mulawToPCM(muLawBuffer: Buffer): Buffer {
    const pcmBuffer = Buffer.alloc(muLawBuffer.length * 2);

    for (let i = 0; i < muLawBuffer.length; i++) {
      let muLawSample = muLawBuffer[i];
      let pcmSample = this.decodeMuLawSample(muLawSample);
      pcmBuffer.writeInt16LE(pcmSample, i * 2);
    }

    return pcmBuffer;
  }

  decodeMuLawSample(muLawByte: number): number {
    const MULAW_BIAS = 33;
    const MULAW_CLIP = 32635;

    muLawByte = ~muLawByte;
    let sign = (muLawByte & 0x80) ? -1 : 1;
    let exponent = (muLawByte >> 4) & 0x07;
    let mantissa = muLawByte & 0x0F;
    let sample = ((mantissa << 3) + MULAW_BIAS) << exponent;
    sample = sign * sample;
    return Math.min(Math.max(sample, -MULAW_CLIP), MULAW_CLIP);
  }
}