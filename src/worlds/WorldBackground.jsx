// src/worlds/WorldBackground.jsx
import React, { useMemo } from 'react'
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

export default function WorldBackground() {
  const { activeIndex } = useWorld()

  // Only render active world and its immediate neighbors to reduce DOM load
  const visibleIndices = useMemo(() => {
    const set = new Set()
    set.add(activeIndex)
    if (activeIndex > 0) set.add(activeIndex - 1)
    if (activeIndex < worlds.length - 1) set.add(activeIndex + 1)
    return set
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
      {worlds.map((world, i) => {
        if (!visibleIndices.has(i)) return null
        return (
          <div
            key={world.id}
            style={{
              position: 'absolute',
              inset: 0,
              background: world.palette.bgGradient || world.palette.bg,
              opacity: i === activeIndex ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              willChange: i === activeIndex ? 'auto' : 'opacity',
            }}
          />
        )
      })}
    </div>
  )
}
