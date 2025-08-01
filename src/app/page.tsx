'use client'

import * as msgpack from '@msgpack/msgpack'
import { useRef, useState, KeyboardEvent, useEffect } from 'react'
import IconLoading from '@/app/assets/loading.svg'
import IconSend from '@/app/assets/send.svg'
import VideoPlayer from './components/player'
import Message, { cleanPlaying } from './components/message'
import { MessageItem } from './types'

async function getDuration(audio: Uint8Array) {
  const audioContext = new AudioContext()
  const audioBuffer = await audioContext.decodeAudioData(
    audio.buffer as ArrayBuffer
  )
  return Math.trunc(audioBuffer.duration)
}

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64)
  const uint8Array = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  return uint8Array
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array - The input array to shuffle
 * @returns A new shuffled array (does not modify the original)
 */
function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid modifying the original array
  const shuffled = [...array]

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  const id = useRef(0)
  const [videos, setVideos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [messages, setMessages] = useState<MessageItem[]>([])

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cleanPlaying()
      }
    })
    fetch(`/videos.json?t=${Date.now()}`)
      .then(resp => resp.json())
      .then(items => {
        setVideos(shuffleArray(items).slice(0, 5) as string[])
      })
  }, [])

  const onSend = async () => {
    const inputMessage: MessageItem = {
      id: id.current++,
      role: 'user',
      content: content.slice(0, 200)
    }
    const outputMessage: MessageItem = {
      id: id.current++,
      role: 'assistant',
      content: '',
      loading: true,
      duration: 0
    }
    messages.push(inputMessage)
    const payload = msgpack.encode({
      messages: messages.map(item => ({
        role: item.role,
        content: item.content
      }))
    })
    setContent('')
    setLoading(true)
    fetch('/api/chat', {
      method: 'POST',
      body: payload
    })
      .then(async resp => {
        const message = await resp.json()
        outputMessage.content = message.data.content
        outputMessage.audio = base64ToUint8Array(message.data.audioText!)
        outputMessage.duration = await getDuration(outputMessage.audio.slice())
        outputMessage.loading = false
        setMessages([...messages])
      })
      .finally(() => {
        setLoading(false)
      })
    messages.push(outputMessage)
    setMessages([...messages])
    setTimeout(() => {
      container.current?.scrollTo({
        top: container.current!.scrollHeight
      })
    }, 100)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && content.trim() && !loading) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="h-screen max-w-sm mx-auto bg-black overflow-hidden relative">
      <VideoPlayer
        videoUrls={videos}
        className="absolute -top-7 left-0 w-full h-full object-cover object-top
          transition-opacity duration-1000"
      />
      <div className="h-screen linear-mask relative flex flex-col items-center justify-end p-5 overflow-hidden">
        <div className="flex-1"></div>
        <div className="max-h-80 w-full overflow-auto py-5" ref={container}>
          <div className="w-full flex flex-col items-start gap-4 py-6 message-list">
            {messages.map(item => (
              <Message message={item} key={item.id} />
            ))}
          </div>
        </div>
        <div className="py-3 relative w-full">
          <div className="border border-white/30 rounded-full h-11 flex items-center px-4 gap-3">
            <input
              className="bg-transparent border-none outline-0 flex-1 resize-none text-sm"
              placeholder="Chat with Builda"
              disabled={loading}
              onKeyDown={onKeyDown}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <button
              disabled={loading || !content.trim()}
              className="text-xl disabled:opacity-50"
              onClick={onSend}
            >
              {loading ? <IconLoading /> : <IconSend />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
