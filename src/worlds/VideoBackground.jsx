// src/worlds/VideoBackground.jsx
import { useRef, useEffect, useState } from 'react'
import { cloudinaryVideo, cloudinaryPoster } from './worlds'

export default function VideoBackground({
  publicId,
  posterTime = 2,
  placement = 'portrait-frame',
  hasAudio = false,
  isActive = false,
}) {
  const videoRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [muted, setMuted] = useState(true)

  const videoUrl = cloudinaryVideo(
    publicId,
    placement === 'ambient-bg' ? 'q_auto,f_auto,w_1280' : 'q_auto,f_auto,w_720'
  )
  const posterUrl = cloudinaryPoster(publicId, posterTime)

  useEffect(() => {
    if (!videoRef.current) return
    if (isActive) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isActive])

  const containerStyles = {
    'portrait-frame': {
      width: 280,
      maxWidth: '80vw',
      aspectRatio: '9/16',
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      position: 'relative',
    },
    'split-screen': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    'ambient-bg': {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    },
    'inline-clip': {
      width: 200,
      maxWidth: '60vw',
      aspectRatio: '9/16',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
    },
  }

  return (
    <div style={containerStyles[placement] || containerStyles['portrait-frame']}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        loop
        muted={muted}
        playsInline
        preload="none"
        onLoadedData={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
      {!loaded && (
        <img
          src={posterUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {hasAudio && (
        <button
          onClick={() => setMuted(!muted)}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
        </button>
      )}
    </div>
  )
}
