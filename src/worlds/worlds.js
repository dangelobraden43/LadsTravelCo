// src/worlds/worlds.js
// World configuration — add a world by adding an object. No code changes needed.

export const CLOUDINARY_CLOUD = 'doonck2rm'

export function cloudinaryVideo(publicId, transforms = 'q_auto,f_auto,w_1280') {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/${transforms}/${publicId}.mp4`
}

export function cloudinaryPoster(publicId, seconds = 2) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_${seconds},w_800,f_jpg/${publicId}.jpg`
}

const worlds = [
  {
    id: 'pub',
    name: 'The Pub',
    scrollRange: [0, 0.14],
    palette: {
      bg: '#1a1510',
      bgGradient: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.08) 0%, #1a1510 60%)',
      accent: '#c9a84c',
      text: '#e8dcc8',
      muted: '#b8ad9a',
    },
    texture: 'wood-grain',
    particles: {
      type: 'dust',
      count: 50,
      speed: 0.2,
      size: 2.5,
      opacity: 0.35,
      color: '#c9a84c',
    },
    video: {
      publicId: 'IrishSong_qqxzzr',
      placement: 'portrait-frame',
      posterTime: 3,
      hasAudio: true,
    },
  },
  {
    id: 'globe',
    name: 'The Globe',
    scrollRange: [0.14, 0.28],
    palette: {
      bg: '#0a0e14',
      bgGradient: 'radial-gradient(ellipse at 50% 50%, #0d1117 0%, #0a0e14 70%)',
      accent: '#6b8f9e',
      text: '#e8dcc8',
      muted: '#8a8070',
    },
    texture: null,
    particles: {
      type: 'stars',
      count: 80,
      speed: 0.05,
      size: 1.5,
      opacity: 0.6,
      color: '#ffffff',
    },
    video: null,
  },
  {
    id: 'cities',
    name: 'The Cities',
    scrollRange: [0.28, 0.46],
    palette: {
      bg: '#1C1510',
      bgGradient: 'linear-gradient(135deg, #1C1510 0%, #1a1410 100%)',
      accent: '#c47a5a',
      text: '#e8dcc8',
      muted: '#b8ad9a',
    },
    texture: 'stone',
    particles: {
      type: 'dust',
      count: 40,
      speed: 0.15,
      size: 2,
      opacity: 0.25,
      color: '#d4a843',
    },
    video: {
      publicId: 'Montserrat_fvwtgo',
      placement: 'split-screen',
      posterTime: 3,
      hasAudio: false,
    },
  },
  {
    id: 'wild',
    name: 'The Wild',
    scrollRange: [0.46, 0.6],
    palette: {
      bg: '#0e150e',
      bgGradient: 'linear-gradient(180deg, #0e150e 0%, #0a1210 100%)',
      accent: '#7a9a6a',
      text: '#e8dcc8',
      muted: '#8a8070',
    },
    texture: null,
    particles: {
      type: 'firefly',
      count: 30,
      speed: 0.1,
      size: 3,
      opacity: 0.5,
      color: '#c9a84c',
    },
    video: {
      publicId: 'SmokeyNP_eewi1h',
      placement: 'portrait-frame',
      posterTime: 3,
      hasAudio: false,
    },
  },
  {
    id: 'seasons',
    name: 'The Seasons',
    scrollRange: [0.6, 0.75],
    palette: {
      bg: '#12101a',
      bgGradient: 'linear-gradient(180deg, #12101a 0%, #0e0d14 100%)',
      accent: '#9a7ab0',
      text: '#e8dcc8',
      muted: '#8a8070',
    },
    texture: null,
    particles: {
      type: 'petals',
      count: 25,
      speed: 0.3,
      size: 4,
      opacity: 0.4,
      color: '#c4a0a0',
    },
    video: {
      publicId: 'ViennaPalace_auec7z',
      placement: 'portrait-frame',
      posterTime: 2,
      hasAudio: false,
    },
  },
  {
    id: 'system',
    name: 'The System',
    scrollRange: [0.75, 0.88],
    palette: {
      bg: '#0a0a10',
      bgGradient: 'radial-gradient(ellipse at 50% 50%, #0d0d14 0%, #0a0a10 70%)',
      accent: '#c9a84c',
      text: '#e8dcc8',
      muted: '#8a9ab0',
    },
    texture: null,
    particles: {
      type: 'constellation',
      count: 100,
      speed: 0.08,
      size: 1.8,
      opacity: 0.5,
      color: '#c9a84c',
    },
    video: null,
  },
  {
    id: 'pub-return',
    name: 'Back to the Pub',
    scrollRange: [0.88, 1.0],
    palette: {
      bg: '#1a1510',
      bgGradient: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.08) 0%, #1a1510 60%)',
      accent: '#b8886e',
      text: '#e8dcc8',
      muted: '#b8ad9a',
    },
    texture: 'wood-grain',
    particles: {
      type: 'dust',
      count: 50,
      speed: 0.2,
      size: 2.5,
      opacity: 0.35,
      color: '#c9a84c',
    },
    video: {
      publicId: 'TreviScooter_qryefo',
      placement: 'inline-clip',
      posterTime: 8,
      hasAudio: false,
    },
  },
]

export default worlds
