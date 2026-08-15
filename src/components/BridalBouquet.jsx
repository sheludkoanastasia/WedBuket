import { useEffect, useRef, useState } from 'react'

const bouquets = [
  {
    id: 'calla',
    name: 'Букет из калл',
    frames: Array.from({ length: 12 }, (_, i) =>
      `/images/360%20flowers/calla/bouquet-turn-${String(i).padStart(2, '0')}.png`,
    ),
  },
  {
    id: 'sadoviy',
    name: 'Садовый белый',
    frames: Array.from({ length: 8 }, (_, i) =>
      `/images/360%20flowers/sadoviy%20white/g01-${String(i).padStart(2, '0')}.png`,
    ),
  },
]

const DRAG_STEP = 8

function BridalBouquet() {
  const [bouquetIndex, setBouquetIndex] = useState(0)
  const [frame, setFrame] = useState(0)
  const dragging = useRef(false)
  const lastX = useRef(0)

  const bouquet = bouquets[bouquetIndex]
  const framesCount = bouquet.frames.length

  useEffect(() => {
    bouquet.frames.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [bouquet])

  const onPointerDown = (e) => {
    dragging.current = true
    lastX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - lastX.current
    if (Math.abs(dx) >= DRAG_STEP) {
      const steps = Math.trunc(dx / DRAG_STEP)
      setFrame((f) => (f - steps + framesCount * 100) % framesCount)
      lastX.current = e.clientX
    }
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  const prevBouquet = () => {
    setBouquetIndex((i) => (i - 1 + bouquets.length) % bouquets.length)
    setFrame(0)
  }

  const nextBouquet = () => {
    setBouquetIndex((i) => (i + 1) % bouquets.length)
    setFrame(0)
  }

  return (
    <section className="bridal" id="bridal-bouquet">
      <div className="bridal-inner container">
        <h2 className="bridal-title">Букет невесты 360°</h2>
        <p className="bridal-hint">Тяните влево или вправо, чтобы вращать</p>

        <div className="bridal-viewer">
          <button
            type="button"
            className="bridal-arrow"
            onClick={prevBouquet}
            aria-label="Предыдущий букет"
          >
            <img src="/images/previous_arrow.svg" alt="Предыдущий букет" />
          </button>

          <div
            className="bridal-stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              src={bouquet.frames[frame]}
              alt={bouquet.name}
              draggable={false}
            />
          </div>

          <button
            type="button"
            className="bridal-arrow"
            onClick={nextBouquet}
            aria-label="Следующий букет"
          >
            <img src="/images/next_arrow.svg" alt="Следующий букет" />
          </button>
        </div>

        <p className="bridal-name">{bouquet.name}</p>
        <a href="#look-date" className="btn btn-booking">
          Забронировать букет
        </a>
      </div>
    </section>
  )
}

export default BridalBouquet
