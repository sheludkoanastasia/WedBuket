import { useEffect, useMemo, useRef, useState } from 'react'
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

/** Демо-правило свободных дат в пределах допустимого диапазона */
function buildAvailableDays(year, month, today, maxDate) {
  const daysInMonth = getDaysInMonth(year, month)
  const result = []

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = startOfDay(new Date(year, month, day))
    if (date < today || date > maxDate) continue

    const weekday = date.getDay()
    const isWeekend = weekday === 0 || weekday === 6
    const isSlotDay = day % 5 === 0 || day % 7 === 3

    if (isWeekend || isSlotDay) {
      result.push(day)
    }
  }

  return result
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
  const rootRef = useRef(null)

  const selectedDate = useMemo(() => {
    if (selectedDay == null) return null
    return startOfDay(new Date(year, month, selectedDay))
  }, [year, month, selectedDay])

  const available = useMemo(() => {
    return new Set(buildAvailableDays(year, month, today, maxDate))
  }, [year, month, today, maxDate])

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
              const isAvailable = !isPast && available.has(day)
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
            disabled={!selectedDate}
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
        date={formDate}
      />
    </section>
  )
}

export default LookDate
