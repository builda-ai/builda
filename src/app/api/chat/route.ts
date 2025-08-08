/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'
import * as msgpack from '@msgpack/msgpack'
import { SYSTEM_PROMPT } from './config'
import { TextToSpeechCleaner, detectLanguage } from './helper'

interface MessageItem {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: MessageItem[]
}

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL
})

async function text2audio(text: string) {
  const lang = detectLanguage(text)
  text = text.slice(0, lang === 'chinese' ? 200 : 400)
  const voice =
    lang === 'chinese'
      ? process.env.FISH_AUDIO_VOICE_CN
      : process.env.FISH_AUDIO_VOICE_EN
  const payload = {
    text,
    reference_id: voice,
    format: 'mp3',
    chunk_length: 200,
    mp3_bitrate: 128,
    normalize: true,
    latency: 'normal'
  }
  const body = msgpack.encode(payload)
  const resp = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    body,
    headers: {
      'content-type': 'application/msgpack',
      Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`
    }
  })
  const data = await resp.arrayBuffer()
  return new Uint8Array(data)
}

export async function POST(request: Request) {
  const inputBuffer = await request.arrayBuffer()
  const body = msgpack.decode(inputBuffer) as ChatRequest
  const model = process.env.CHAT_MODEL as any
  const messages = body.messages.slice(-10).map(item => ({
    role: item.role,
    content: item.content.slice(0, 1000)
  }))
  const response = await openai.chat.completions.create({
    stream: false,
    model,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...messages
    ]
  })
  let outputText = (response.choices[0].message.content || '').slice(0, 200)
  if (!outputText) {
    return Response.json({
      code: 400,
      message: 'Bad Request'
    })
  }
  outputText = new TextToSpeechCleaner().clean(outputText)
  const outputAudio = await text2audio(outputText)
  const resp = {
    code: 0,
    data: {
      role: 'assistant',
      content: outputText,
      audioText: Buffer.from(outputAudio).toString('base64')
    }
  }
  return Response.json(resp)
}
