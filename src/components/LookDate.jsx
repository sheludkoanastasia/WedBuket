import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchBookingDates, toIsoDate } from '../api/yclients'
import BookingForm from './BookingForm'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

/** 0 = понедельник … 6 = воскресенье */
function getMondayFirstOffset(year, month) {
  const jsDay = new Date(year, month, 1).getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

function isBeforeMonth(year, month, minYear, minMonth) {
  return year < minYear || (year === minYear && month < minMonth)
}

function isAfterMonth(year, month, maxYear, maxMonth) {
  return year > maxYear || (year === maxYear && month > maxMonth)
}

function LookDate() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const maxDate = useMemo(() => {
    const d = startOfDay(new Date())
    d.setFullYear(d.getFullYear() + 1)
    return d
  }, [])

  const minYear = today.getFullYear()
  const minMonth = today.getMonth()
  const maxYear = maxDate.getFullYear()
  const maxMonth = maxDate.getMonth()

  const [year, setYear] = useState(minYear)
  const [month, setMonth] = useState(minMonth)
  const [selectedDay, setSelectedDay] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formDate, setFormDate] = useState(null)
  const [bookingDates, setBookingDates] = useState(() => new Set())
  const [datesLoading, setDatesLoading] = useState(true)
  const [datesError, setDatesError] = useState('')
  const rootRef = useRef(null)
  /** Даты, только что забронированные на сайте — YCLIENTS book_dates обновляется с задержкой */
  const locallyBookedRef = useRef(new Set())

  const applyBookingList = useCallback((list) => {
    const apiSet = new Set(list)
    const next = new Set(list)
    locallyBookedRef.current.forEach((iso) => {
      next.delete(iso)
      // Когда API уже не отдаёт день — локальная пометка больше не нужна
      if (!apiSet.has(iso)) locallyBookedRef.current.delete(iso)
    })
    setBookingDates(next)
  }, [])

  const loadDates = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setDatesLoading(true)
        setDatesError('')
      }
      try {
        const list = await fetchBookingDates()
        applyBookingList(list)
        if (silent) setDatesError('')
      } catch (err) {
        if (!silent) {
          setBookingDates(new Set())
          setDatesError(err.message || 'Не удалось загрузить свободные даты')
        }
      } finally {
        if (!silent) setDatesLoading(false)
      }
    },
    [applyBookingList]
  )

  useEffect(() => {
    loadDates()
  }, [loadDates])

  const selectedDate = useMemo(() => {
    if (selectedDay == null) return null
    return startOfDay(new Date(year, month, selectedDay))
  }, [year, month, selectedDay])

  const cells = useMemo(() => {
    const daysCount = getDaysInMonth(year, month)
    const offset = getMondayFirstOffset(year, month)
    const total = Math.ceil((offset + daysCount) / 7) * 7

    return Array.from({ length: total }, (_, i) => {
      const day = i - offset + 1
      return day >= 1 && day <= daysCount ? day : null
    })
  }, [year, month])

  const canPrevMonth = !(year === minYear && month === minMonth)
  const canNextMonth = !(year === maxYear && month === maxMonth)
  const canPrevYear = !isBeforeMonth(year - 1, month, minYear, minMonth)
  const canNextYear = !isAfterMonth(year + 1, month, maxYear, maxMonth)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (formOpen) return
      if (!rootRef.current?.contains(event.target)) {
        setSelectedDay(null)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [formOpen])

  const openForm = () => {
    if (!selectedDate) return
    setFormDate(selectedDate)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
  }

  const onBooked = (bookedIso) => {
    if (bookedIso) {
      locallyBookedRef.current.add(bookedIso)
      setBookingDates((prev) => {
        const next = new Set(prev)
        next.delete(bookedIso)
        return next
      })
    }
    setSelectedDay(null)

    // Фоновая сверка с API; локально занятые дни из ответа вычитаются
    window.setTimeout(() => {
      loadDates({ silent: true })
    }, 1500)
  }

  useEffect(() => {
    if (formOpen && selectedDate) {
      setFormDate(selectedDate)
    }
  }, [formOpen, selectedDate])

  const goToMonth = (nextYear, nextMonth) => {
    if (isBeforeMonth(nextYear, nextMonth, minYear, minMonth)) return
    if (isAfterMonth(nextYear, nextMonth, maxYear, maxMonth)) return
    setYear(nextYear)
    setMonth(nextMonth)
    setSelectedDay(null)
  }

  const prevMonth = () => {
    if (month === 0) goToMonth(year - 1, 11)
    else goToMonth(year, month - 1)
  }

  const nextMonth = () => {
    if (month === 11) goToMonth(year + 1, 0)
    else goToMonth(year, month + 1)
  }

  const prevYear = () => {
    let nextYear = year - 1
    let nextMonth = month
    if (isBeforeMonth(nextYear, nextMonth, minYear, minMonth)) {
      nextYear = minYear
      nextMonth = minMonth
    }
    goToMonth(nextYear, nextMonth)
  }

  const nextYear = () => {
    let nextYear = year + 1
    let nextMonth = month
    if (isAfterMonth(nextYear, nextMonth, maxYear, maxMonth)) {
      nextYear = maxYear
      nextMonth = maxMonth
    }
    goToMonth(nextYear, nextMonth)
  }

  const onSelectDay = (day, isPast, isAvailable) => {
    if (isPast || !isAvailable) return
    setSelectedDay((current) => (current === day ? null : day))
  }

  return (
    <section className="look-date" id="look-date">
      <div className="look-date-inner container" ref={rootRef}>
        <h2 className="look-date-title">Свободные даты</h2>

        {datesError ? (
          <p className="look-date-status look-date-status--error" role="alert">
            {datesError}
            <button
              type="button"
              className="look-date-retry"
              onClick={() => loadDates()}
            >
              Повторить
            </button>
          </p>
        ) : null}
        {datesLoading ? (
          <p className="look-date-status">Загрузка свободных дат…</p>
        ) : null}

        <div className="look-date-nav">
          <div className="look-date-nav-row">
            <button
              type="button"
              className="look-date-nav-btn"
              onClick={prevMonth}
              disabled={!canPrevMonth}
              aria-label="Предыдущий месяц"
            >
              <img src="/images/previous_arrow.svg" alt="" />
            </button>
            <p className="look-date-month">{MONTHS[month]}</p>
            <button
              type="button"
              className="look-date-nav-btn"
              onClick={nextMonth}
              disabled={!canNextMonth}
              aria-label="Следующий месяц"
            >
              <img src="/images/next_arrow.svg" alt="" />
            </button>
          </div>

          <div className="look-date-nav-row look-date-nav-row--year">
            <button
              type="button"
              className="look-date-nav-btn look-date-nav-btn--sm"
              onClick={prevYear}
              disabled={!canPrevYear}
              aria-label="Предыдущий год"
            >
              <img src="/images/previous_arrow.svg" alt="" />
            </button>
            <p className="look-date-year">{year}</p>
            <button
              type="button"
              className="look-date-nav-btn look-date-nav-btn--sm"
              onClick={nextYear}
              disabled={!canNextYear}
              aria-label="Следующий год"
            >
              <img src="/images/next_arrow.svg" alt="" />
            </button>
          </div>
        </div>

        <div className="calendar">
          <div className="calendar-weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day} className="calendar-weekday">
                {day}
              </span>
            ))}
          </div>

          <div className="calendar-grid">
            {cells.map((day, index) => {
              if (day === null) {
                return <span key={`empty-${index}`} className="calendar-cell" />
              }

              const date = startOfDay(new Date(year, month, day))
              const isPast = date < today
              const iso = toIsoDate(date)
              const isAvailable =
                !isPast && !datesLoading && bookingDates.has(iso)
              const isSelected = selectedDay === day

              return (
                <button
                  key={day}
                  type="button"
                  className={[
                    'calendar-day',
                    isPast ? 'calendar-day--past' : '',
                    isAvailable ? 'calendar-day--available' : '',
                    isSelected ? 'calendar-day--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelectDay(day, isPast, isAvailable)}
                  disabled={isPast || !isAvailable}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        <div className="look-date-footer">
          <p className="look-date-legend">
            *Свободные даты обозначаются зеленым цветом
          </p>
          <button
            type="button"
            className="btn btn-booking look-date-book"
            onClick={openForm}
            disabled={!selectedDate || datesLoading}
            title={
              selectedDate
                ? undefined
                : 'Сначала выберите свободную дату в календаре'
            }
          >
            Забронировать дату
          </button>
        </div>
      </div>

      <BookingForm
        open={formOpen}
        onClose={closeForm}
        onBooked={onBooked}
        date={formDate}
      />
    </section>
  )
}

export default LookDate
