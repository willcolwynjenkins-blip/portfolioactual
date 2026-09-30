import { useEffect, useRef, useState } from 'react'

const assetPathPrefix = '/assets'
const imgImage10 = `${assetPathPrefix}/e1d9e.png`
const img8921247912A370D197K2 = `${assetPathPrefix}/b8e89.png`
const imgImage20 = `${assetPathPrefix}/19a14.png`
const imgImage17 = `${assetPathPrefix}/e48a4.png`
const img3441056553Df03Eae0E1B2 = `${assetPathPrefix}/f7750.png`
const imgImage22 = `${assetPathPrefix}/03836.png`

function GallerySequence({ duplicate, now }: { duplicate: boolean; now: Date }) {
  const date = `${now.getFullYear()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)} ${now.getDate()}`
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now)

  return (
    <div className="gallery-sequence" aria-hidden={duplicate || undefined}>
      <section className="gallery-hero" aria-label={duplicate ? undefined : 'Will Colwyn photo essay'}>
        <img src={imgImage10} alt={duplicate ? '' : 'Empty interior with gray carpet and warm overhead lights'} />
        <div className="gallery-title">
          <p>Will Colwyn</p>
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </section>

      <div className="gallery-panel gallery-parking">
        <img src={img8921247912A370D197K2} alt={duplicate ? '' : 'Golden light falling across an empty concrete parking garage'} />
      </div>

      <div className="gallery-mosaic">
        <div className="gallery-panel gallery-street">
          <img src={img3441056553Df03Eae0E1B2} alt={duplicate ? '' : 'Pedestrians at a city intersection'} />
        </div>
        <div className="gallery-panel gallery-architecture">
          <img src={imgImage20} alt={duplicate ? '' : 'Black-and-white view of a monumental urban building'} />
        </div>
        <div className="gallery-panel gallery-chapel">
          <img src={imgImage17} alt={duplicate ? '' : 'Sunlight forming a cross inside a quiet chapel'} />
        </div>
      </div>

      <div className="gallery-panel gallery-studio">
        <img src={imgImage22} alt={duplicate ? '' : 'A spacious studio with people, garments, and work tables'} />
      </div>
    </div>
  )
}

export default function App() {
  const [now, setNow] = useState(() => new Date())
  const firstSequence = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let sequenceHeight = firstSequence.current?.offsetHeight ?? 0
    let frame = 0
    let previousTime = 0
    let pausedUntil = 0
    const resizeObserver = new ResizeObserver(() => {
      sequenceHeight = firstSequence.current?.offsetHeight ?? 0
    })
    if (firstSequence.current) resizeObserver.observe(firstSequence.current)

    const pause = () => { pausedUntil = performance.now() + 4000 }
    const pauseForKey = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) pause()
    }

    const animate = (time: number) => {
      const elapsed = Math.min(time - (previousTime || time), 40)
      previousTime = time

      if (sequenceHeight > 0) {
        if (window.scrollY >= sequenceHeight) {
          window.scrollTo(0, window.scrollY - sequenceHeight)
        } else if (time >= pausedUntil && !document.hidden) {
          window.scrollTo(0, window.scrollY + elapsed * 0.035)
        }
      }
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener('wheel', pause, { passive: true })
    window.addEventListener('touchstart', pause, { passive: true })
    window.addEventListener('pointerdown', pause, { passive: true })
    window.addEventListener('keydown', pauseForKey)
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('wheel', pause)
      window.removeEventListener('touchstart', pause)
      window.removeEventListener('pointerdown', pause)
      window.removeEventListener('keydown', pauseForKey)
    }
  }, [])

  return (
    <main className="gallery" aria-label="Will Colwyn image gallery">
      <div ref={firstSequence}><GallerySequence duplicate={false} now={now} /></div>
      <GallerySequence duplicate now={now} />
    </main>
  )
}
