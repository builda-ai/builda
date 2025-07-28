'use client'

import classNames from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import SoundIcon from './sound-icon'
import IconLoading from '../assets/loading.svg'
import { MessageItem } from '../types'

interface MessageProps {
  message: MessageItem
}

interface PlayingMessage {
  id: number
  source: AudioBufferSourceNode | null
}

const playingMessasge: PlayingMessage = {
  id: -1,
  source: null
}

export default function Message({ message }: MessageProps) {
  const [playing, setPlaying] = useState(false)
  const isPlaying = useRef(false)
  const source = useRef<AudioBufferSourceNode>(null)

  const onPlay = useCallback(async () => {
    if (!message.audio) return
    if (!source.current) {
      const context = new AudioContext()
      const audioBuffer = await context.decodeAudioData(
        (message.audio.buffer as ArrayBuffer).slice(0)
      )
      source.current = context.createBufferSource()
      source.current.buffer = audioBuffer
      source.current.connect(context.destination)
      source.current.addEventListener('ended', () => {
        isPlaying.current = false
        setPlaying(false)
        source.current = null
        if (playingMessasge.id === message.id) {
          playingMessasge.id = -1
          playingMessasge.source = source.current
        }
      })
    }
    if (
      playingMessasge.id &&
      playingMessasge.id !== message.id &&
      playingMessasge.source
    ) {
      playingMessasge.source.stop()
    }
    if (isPlaying.current) {
      source.current?.stop()
    } else {
      isPlaying.current = true
      setPlaying(true)
      source.current.start()
      playingMessasge.id = message.id
      playingMessasge.source = source.current
    }
  }, [message])

  useEffect(() => {
    if (!navigator.userAgent.includes('Mobile')) {
      onPlay()
    }
  }, [onPlay, message.loading])

  const renderContent = () => {
    if (message.loading) {
      return (
        <div className="w-full flex items-center justify-center">
          <IconLoading className="text-lg" />
        </div>
      )
    }
    if (message.audio && message.duration) {
      return (
        <>
          <SoundIcon size={18} playing={playing} />
          <span>{message.duration.toLocaleString('en-US')}″</span>
        </>
      )
    }
    return <div>{message.content}</div>
  }

  return (
    <div
      className={classNames(
        'flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-md px-3 py-1.5 min-h-10 max-w-3/5 text-white/70',
        {
          'self-end': message.role === 'user'
        }
      )}
      onClick={onPlay}
    >
      {renderContent()}
    </div>
  )
}
