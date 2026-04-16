// src/worlds/WorldTexture.jsx
import { useWorld } from './useWorldScroll'
import worlds from './worlds'

const TEXTURE_MAP = {
  'wood-grain': '/textures/wood-grain.webp',
  stone: '/textures/stone.webp',
}

export default function WorldTexture() {
  const { activeWorld } = useWorld()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {worlds.map((world) => {
        if (!world.texture) return null
        const src = TEXTURE_MAP[world.texture]
        if (!src) return null

        return (
          <div
            key={world.id}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '400px',
              mixBlendMode: 'overlay',
              opacity: activeWorld.id === world.id ? 0.06 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          />
        )
      })}
    </div>
  )
}
