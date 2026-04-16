// src/worlds/WorldBackground.jsx
import React, { useRef, useEffect } from 'react'
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

export default function WorldBackground() {
  const { activeIndex } = useWorld()
  const layersRef = useRef([])

  useEffect(() => {
    layersRef.current.forEach((layer, i) => {
      if (!layer) return
      layer.style.opacity = i === activeIndex ? '1' : '0'
    })
  }, [activeIndex])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {worlds.map((world, i) => (
        <div
          key={world.id}
          ref={(el) => (layersRef.current[i] = el)}
          style={{
            position: 'absolute',
            inset: 0,
            background: world.palette.bgGradient || world.palette.bg,
            opacity: i === 0 ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
