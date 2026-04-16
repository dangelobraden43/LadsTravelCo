// src/worlds/useWorldScroll.js
import { useState, useEffect, createContext, useContext } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import worlds from './worlds'

const WorldContext = createContext({
  activeWorld: worlds[0],
  activeIndex: 0,
  worldProgress: 0,
  globalProgress: 0,
})

export function useWorld() {
  return useContext(WorldContext)
}

export function useWorldScroll(containerRef) {
  const [state, setState] = useState({
    activeWorld: worlds[0],
    activeIndex: 0,
    worldProgress: 0,
    globalProgress: 0,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        let activeIndex = 0

        for (let i = 0; i < worlds.length; i++) {
          const [start, end] = worlds[i].scrollRange
          if (progress >= start && progress < end) {
            activeIndex = i
            break
          }
          if (i === worlds.length - 1) activeIndex = i
        }

        const world = worlds[activeIndex]
        const [start, end] = world.scrollRange
        const worldProgress = Math.min(1, Math.max(0, (progress - start) / (end - start)))

        setState({
          activeWorld: world,
          activeIndex,
          worldProgress,
          globalProgress: progress,
        })
      },
    })

    return () => trigger.kill()
  }, [containerRef])

  return state
}

export { WorldContext }
