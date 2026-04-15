import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0, left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  })

  ScrollTrigger.addEventListener('refresh', () => lenis.resize())
  ScrollTrigger.refresh()

  return lenis
}

export function revealOnScroll(element, options = {}) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 1.0,
      ease: 'power3.out',
      delay: options.delay || 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

export function countUpOnScroll(element, target, suffix = '') {
  const obj = { val: 0 }
  return gsap.to(obj, {
    val: target,
    duration: 2.0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
    onUpdate: () => {
      element.textContent = Math.round(obj.val) + suffix
    },
  })
}

export function pinnedSection(trigger, options = {}) {
  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: options.end || '+=100%',
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
  })
}

export function staggerReveal(elements, options = {}) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: options.stagger || 0.12,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        once: true,
      },
    }
  )
}

export { gsap, ScrollTrigger }
