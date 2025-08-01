import React, { useState, useEffect, useRef, useCallback } from 'react'

interface VideoPlayerProps {
  videoUrls: string[]
  preloadCount?: number
  className?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrls,
  preloadCount = 3,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const preloadVideosRef = useRef<Map<number, HTMLVideoElement>>(new Map())
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [playOrder, setPlayOrder] = useState<number[]>([])
  const [orderIndex, setOrderIndex] = useState<number>(0)

  // Initialize random play order
  useEffect(() => {
    if (videoUrls.length === 0) return

    // Fisher-Yates shuffle
    const shuffled = [...Array(videoUrls.length).keys()]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setPlayOrder(shuffled)
    setCurrentIndex(shuffled[0])
    setOrderIndex(0)
  }, [videoUrls.length])

  // Preload videos
  const preloadVideo = useCallback(
    (index: number) => {
      if (!videoUrls[index] || preloadVideosRef.current.has(index)) return

      const video = document.createElement('video')
      video.src = videoUrls[index]
      video.preload = 'auto'
      video.load()

      preloadVideosRef.current.set(index, video)
    },
    [videoUrls]
  )

  // Preload next videos in queue
  useEffect(() => {
    if (playOrder.length === 0) return

    // Adjust preloadCount to not exceed available videos
    const effectivePreloadCount = Math.min(preloadCount, videoUrls.length - 1)

    // Skip preloading if only one video or no videos to preload
    if (effectivePreloadCount <= 0) return

    // Preload upcoming videos
    for (let i = 1; i <= effectivePreloadCount; i++) {
      const nextIndex = (orderIndex + i) % playOrder.length
      preloadVideo(playOrder[nextIndex])
    }

    // Clean up unused preloaded videos
    const keepIndices = new Set<number>()
    // Include current video and next videos to preload
    for (let i = 0; i <= effectivePreloadCount; i++) {
      const idx = (orderIndex + i) % playOrder.length
      keepIndices.add(playOrder[idx])
    }

    preloadVideosRef.current.forEach((video, index) => {
      if (!keepIndices.has(index)) {
        video.src = ''
        preloadVideosRef.current.delete(index)
      }
    })
  }, [orderIndex, playOrder, videoUrls, preloadCount, preloadVideo])

  // Handle video ended
  const handleVideoEnded = () => {
    if (videoUrls.length === 1) {
      // For single video, just replay it
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(err => {
          console.error('Video replay failed:', err)
        })
      }
      return
    }

    const nextOrderIndex = (orderIndex + 1) % playOrder.length
    setOrderIndex(nextOrderIndex)

    // Reshuffle when starting over
    if (nextOrderIndex === 0) {
      const shuffled = [...playOrder]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setPlayOrder(shuffled)
    }

    setCurrentIndex(playOrder[nextOrderIndex])
  }

  // Handle video error
  const handleVideoError = () => {
    console.error('Video load error:', videoUrls[currentIndex])
    handleVideoEnded()
  }

  // Play video when index changes
  useEffect(() => {
    if (videoRef.current && videoUrls[currentIndex]) {
      videoRef.current.load()
      videoRef.current.play().catch(err => {
        console.error('Video play failed:', err)
      })
    }
  }, [currentIndex, videoUrls])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      preloadVideosRef.current.forEach(video => {
        video.src = ''
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      preloadVideosRef.current.clear()
    }
  }, [])

  if (videoUrls.length === 0) return null

  return (
    <video
      ref={videoRef}
      className={className}
      src={videoUrls[currentIndex]}
      onEnded={handleVideoEnded}
      onError={handleVideoError}
      autoPlay
      muted
      playsInline
    />
  )
}

export default VideoPlayer
