'use client'

import { useEffect, type RefObject } from 'react'

export function useAutoSlider(
  ref: RefObject<HTMLElement>,
  enabled = true,
  intervalMs = 2800,
) {
  useEffect(() => {
    if (!enabled) return
    const track = ref.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let dir = 1
    let paused = false
    let resumeTimer: ReturnType<typeof setTimeout> | undefined

    const closest = () => {
      const slides = Array.from(track.children).filter(el => !el.getAttribute('aria-hidden')) as HTMLElement[]
      const pos = track.scrollLeft
      let best = 0
      let min = Infinity
      slides.forEach((s, i) => {
        const d = Math.abs(pos - s.offsetLeft)
        if (d < min) {
          min = d
          best = i
        }
      })
      return { slides, idx: best }
    }

    const tick = () => {
      if (paused) return
      const { slides, idx } = closest()
      if (slides.length <= 1) return
      let next = idx + dir
      if (next > slides.length - 1) {
        dir = -1
        next = idx - 1
      } else if (next < 0) {
        dir = 1
        next = idx + 1
      }
      const target = slides[next]
      if (target) track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
    }

    const id = setInterval(tick, intervalMs)
    const pause = () => {
      paused = true
      if (resumeTimer) clearTimeout(resumeTimer)
    }
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        paused = false
      }, 4000)
    }

    track.addEventListener('pointerdown', pause)
    track.addEventListener('pointerup', scheduleResume)
    track.addEventListener('touchstart', pause, { passive: true })
    track.addEventListener('touchend', scheduleResume, { passive: true })

    return () => {
      clearInterval(id)
      if (resumeTimer) clearTimeout(resumeTimer)
      track.removeEventListener('pointerdown', pause)
      track.removeEventListener('pointerup', scheduleResume)
      track.removeEventListener('touchstart', pause)
      track.removeEventListener('touchend', scheduleResume)
    }
  }, [ref, enabled, intervalMs])
}
