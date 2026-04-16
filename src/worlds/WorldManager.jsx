// src/worlds/WorldManager.jsx
import React, { useRef } from 'react'
import { WorldContext, useWorldScroll } from './useWorldScroll'
import WorldBackground from './WorldBackground'
import WorldParticles from './WorldParticles'
import WorldTexture from './WorldTexture'

export default function WorldManager({ children }) {
  const containerRef = useRef(null)
  const worldState = useWorldScroll(containerRef)

  return (
    <WorldContext.Provider value={worldState}>
      <div ref={containerRef} style={{ position: 'relative', zIndex: 0 }}>
        <WorldBackground />
        <WorldParticles />
        <WorldTexture />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    </WorldContext.Provider>
  )
}
