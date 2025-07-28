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
  source: HTMLAudioElement | null
}

export const playingMessasge: PlayingMessage = {
  id: -1,
  source: null
}

export function cleanPlaying() {
  if (playingMessasge.source) {
    playingMessasge.source.pause()
    playingMessasge.id = -1
    playingMessasge.source = null
  }
}

export default function Message({ message }: MessageProps) {
  const [playing, setPlaying] = useState(false)
  const isPlaying = useRef(false)
  const blobUrl = useRef('')
  const audio = useRef<HTMLAudioElement>(null)

  const onPlay = useCallback(async () => {
    if (!message.audio || !audio.current) return
    audio.current.currentTime = 0
    if (
      playingMessasge.id &&
      playingMessasge.id !== message.id &&
      playingMessasge.source
    ) {
      playingMessasge.source.pause()
    }
    if (isPlaying.current) {
      audio.current.pause()
    } else {
      isPlaying.current = true
      setPlaying(true)
      audio.current.play()
      playingMessasge.id = message.id
      playingMessasge.source = audio.current
    }
  }, [message])

  const clean = useCallback(() => {
    isPlaying.current = false
    setPlaying(false)
    if (playingMessasge.id === message.id) {
      cleanPlaying()
    }
  }, [message.id])

  useEffect(() => {
    if (!message.audio) return
    if (blobUrl.current) {
      URL.revokeObjectURL(blobUrl.current)
    }
    const blob = new Blob([message.audio], { type: 'audio/mp3' })
    blobUrl.current = URL.createObjectURL(blob)
    if (!audio.current) {
      audio.current = new Audio(blobUrl.current)
      audio.current.addEventListener('ended', () => {
        clean()
      })
      audio.current.addEventListener('pause', () => {
        clean()
      })
    } else {
      audio.current.src = blobUrl.current
    }
    if (!navigator.userAgent.includes('Mobile')) {
      onPlay()
    }
  }, [message.audio, message.id, onPlay, clean])

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
        'flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-md px-3 py-1.5 min-h-10 max-w-3/5 text-white/70 cursor-pointer',
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
