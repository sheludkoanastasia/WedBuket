import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createBooking,
  fetchBookingTime,
  toIsoDate,
} from '../api/yclients'

const EVENT_TYPES = [
  { id: 'wedding', name: 'Свадьба' },
  { id: 'proposal', name: 'Предложение' },
  { id: 'other', name: 'Другое' },
]

const BOUQUETS = [
  { id: 'consult', name: 'Индвивидуальная композиция' },
  { id: 'calla', name: 'Букет из калл' },
  { id: 'sadoviy', name: 'Садовый белый' },
]

const EXTRA_OPTIONS = [
  { id: 'bouquet-only', label: 'только букет невесты', fullRow: true },
  { id: 'boutonnieres', label: 'бутоньерки' },
  { id: 'ceremony', label: 'церемония' },
  { id: 'banquet', label: 'банкет' },
  { id: 'other', label: 'другое' },
]

function formatDate(date) {
  if (!date) return '—'
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}


function formatRuPhoneFromDigits(digits) {
  let d = digits.replace(/\D/g, '')
  if (d.startsWith('8')) d = `7${d.slice(1)}`
  if (!d.startsWith('7')) d = `7${d}`
  d = d.slice(0, 11)

  const local = d.slice(1)
  let result = '+7'
  if (!local.length) return result

  result += `(${local.slice(0, Math.min(3, local.length))}`
  if (local.length < 3) return result

  result += ')'
  if (local.length === 3) return result

  result += `-${local.slice(3, Math.min(6, local.length))}`
  if (local.length <= 6) return result

  result += `-${local.slice(6, Math.min(8, local.length))}`
  if (local.length <= 8) return result

  result += `-${local.slice(8, 10)}`
  return result
}

function phoneDigits(value) {
  return value.replace(/\D/g, '')
}

const BUDGET_STEP = 5000

const initialExtras = () =>
  Object.fromEntries(EXTRA_OPTIONS.map((o) => [o.id, false]))

function ExpandSelect({
  options,
  value,
  onChange,
  required = false,
  name,
  placeholder = 'Выберите',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((o) => o.id === value)

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])

  return (
    <div
      className={`booking-dropdown${open ? ' is-open' : ''}`}
      ref={rootRef}
    >
      <button
        type="button"
        className="booking-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`booking-dropdown-value${
            selected ? '' : ' booking-dropdown-value--placeholder'
          }`}
        >
          {selected?.name || placeholder}
        </span>
        <img
          className="booking-dropdown-chevron"
          src="/images/chevronDownList.svg"
          alt=""
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul className="booking-dropdown-list" role="listbox">
          {options.map((opt) => (
            <li key={opt.id} role="none">
              <button
                type="button"
                role="option"
                aria-selected={value === opt.id}
                className={`booking-dropdown-option${
                  value === opt.id ? ' is-selected' : ''
                }`}
                onClick={() => {
                  onChange(opt.id)
                  setOpen(false)
                }}
              >
                {opt.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        type="text"
        className="booking-dropdown-hidden"
        name={name}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        onChange={() => {}}
      />
    </div>
  )
}

function ClearableField({
  as = 'input',
  value,
  onChange,
  onClear,
  hasValue,
  className = '',
  wrapClassName = '',
  inputRef,
  ...props
}) {
  const showClear = hasValue ?? Boolean(value)

  return (
    <div
      className={`booking-clearable${
        as === 'textarea' ? ' booking-clearable--textarea' : ''
      }${wrapClassName ? ` ${wrapClassName}` : ''}`}
    >
      {as === 'textarea' ? (
        <textarea
          ref={inputRef}
          className={className}
          value={value}
          onChange={onChange}
          {...props}
        />
      ) : (
        <input
          ref={inputRef}
          className={className}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
      {showClear ? (
        <button
          type="button"
          className="booking-field-clear"
          onClick={onClear}
          aria-label="Очистить поле"
          tabIndex={-1}
        >
          <img src="/images/Cross.svg" alt="" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

function BookingCheck({
  checked,
  onChange,
  children,
  className = '',
  required = false,
}) {
  return (
    <label className={`booking-check ${className}`.trim()}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
      />
      <span className="booking-check-box" aria-hidden="true">
        <img
          className="booking-check-mark"
          src="/images/checkYes.svg"
          alt=""
        />
      </span>
      {children}
    </label>
  )
}

/** Поля записи YCLIENTS (ключи = code доп. полей) */
function buildCustomFields({
  eventType,
  venue,
  extras,
  bouquet,
  budget,
  budgetDiscuss,
  refs,
}) {
  const eventName =
    EVENT_TYPES.find((o) => o.id === eventType)?.name || eventType || ''
  const bouquetName =
    BOUQUETS.find((o) => o.id === bouquet)?.name || bouquet || ''
  const extrasList = EXTRA_OPTIONS.filter((o) => extras[o.id])
    .map((o) => o.label)
    .join(', ')
  const budgetText = budgetDiscuss
    ? 'обсудим'
    : budget
      ? `до ${budget}`
      : ''

  return {
    event_type: eventName,
    venue: venue.trim(),
    extras: extrasList,
    bouquet: bouquetName,
    budget: budgetText,
    refs: refs.trim(),
  }
}

function BookingForm({ open, onClose, onBooked, date }) {
  const titleId = useId()
  const sectionRef = useRef(null)
  const refsAreaRef = useRef(null)
  const [eventType, setEventType] = useState('')
  const [venue, setVenue] = useState('')
  const [extras, setExtras] = useState(initialExtras)
  const [bouquet, setBouquet] = useState('')
  const [budget, setBudget] = useState('')
  const [budgetDiscuss, setBudgetDiscuss] = useState(false)
  const [refs, setRefs] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitOk, setSubmitOk] = useState(false)

  useEffect(() => {
    if (!open || !sectionRef.current) return
    sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [open])

  useEffect(() => {
    if (!open) return
    setSubmitError('')
    setSubmitOk(false)
    setSubmitting(false)
  }, [open, date])

  useEffect(() => {
    if (!submitOk) return undefined
    const timer = window.setTimeout(() => {
      onClose()
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [submitOk, onClose])

  useEffect(() => {
    const el = refsAreaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [refs, open])

  if (!open) return null

  const toggleExtra = (id) => {
    setExtras((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (id === 'bouquet-only' && next[id]) {
        EXTRA_OPTIONS.forEach((o) => {
          if (o.id !== 'bouquet-only') next[o.id] = false
        })
      } else if (id !== 'bouquet-only' && next[id]) {
        next['bouquet-only'] = false
      }
      return next
    })
  }

  const onPhoneChange = (e) => {
    const nextRaw = e.target.value
    const prevDigits = phoneDigits(phone)
    let nextDigits = phoneDigits(nextRaw)

    // Backspace по скобке/дефису: цифры не меняются — убираем последнюю цифру вручную
    if (
      nextRaw.length < phone.length &&
      nextDigits.length >= prevDigits.length &&
      prevDigits.length > 1
    ) {
      nextDigits = prevDigits.slice(0, -1)
    }

    setPhone(formatRuPhoneFromDigits(nextDigits))
  }

  const onBudgetChange = (e) => {
    setBudget(e.target.value.replace(/\D/g, ''))
  }

  const bumpBudget = (delta) => {
    if (budgetDiscuss) return
    const current = Number(budget) || 0
    const next = Math.max(0, current + delta)
    setBudget(String(next))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!consent || submitting) return
    if (phoneDigits(phone).length !== 11) return
    if (!date) {
      setSubmitError('Сначала выберите дату в календаре')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    setSubmitOk(false)

    try {
      const dateIso = toIsoDate(date)
      const slot = await fetchBookingTime(dateIso)
      if (!slot?.datetime) {
        throw new Error('На эту дату больше нет свободного слота')
      }

      await createBooking({
        name: name.trim(),
        phone: phoneDigits(phone),
        email: 'client@wedbuket.ru',
        datetime: slot.datetime,
        comment: 'Заявка с сайта WedBuket',
        custom_fields: buildCustomFields({
          eventType,
          venue,
          extras,
          bouquet,
          budget,
          budgetDiscuss,
          refs,
        }),
      })

      setSubmitOk(true)
      onBooked?.(dateIso)
    } catch (err) {
      setSubmitError(err.message || 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="booking-panel"
      id="booking-form"
      aria-labelledby={titleId}
    >
      <div className="booking-panel-inner container">
        <form className="booking-form" onSubmit={onSubmit}>
          <div className="booking-title-row">
            <h2 id={titleId} className="booking-heading">
              О событии
            </h2>
            <button
              type="button"
              className="booking-close"
              onClick={onClose}
              aria-label="Закрыть форму"
            >
              <img
                src="/images/menu-close.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="booking-row booking-row--select">
            <span className="booking-label">Тип события</span>
            <ExpandSelect
              name="eventType"
              options={EVENT_TYPES}
              value={eventType}
              onChange={setEventType}
              placeholder="Свадьба, предложение…"
              required
            />
          </div>

          <div className="booking-row booking-row--line">
            <span className="booking-label">Город, площадка</span>
            <ClearableField
              className="booking-input-line"
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              onClear={() => setVenue('')}
              placeholder="Москва, Loft Hall"
              autoComplete="address-level2"
            />
          </div>

          <fieldset className="booking-fieldset">
            <legend className="booking-label">Что нужно кроме букета</legend>
            <div className="booking-checks">
              {EXTRA_OPTIONS.map((opt) => (
                <BookingCheck
                  key={opt.id}
                  className={opt.fullRow ? 'booking-check--full' : ''}
                  checked={extras[opt.id]}
                  onChange={() => toggleExtra(opt.id)}
                >
                  <span>{opt.label}</span>
                </BookingCheck>
              ))}
            </div>
          </fieldset>

          <div className="booking-row booking-row--select">
            <span className="booking-label">Букет невесты</span>
            <ExpandSelect
              name="bouquet"
              options={BOUQUETS}
              value={bouquet}
              onChange={setBouquet}
              placeholder="Выберите букет"
            />
          </div>

          <div className="booking-row booking-row--budget">
            <span className="booking-label">Ориентир по бюджету</span>
            <div className="booking-budget">
              <div className="booking-budget-line">
                <span className="booking-budget-prefix">до</span>
                <div className="booking-budget-field">
                  <input
                    className="booking-input-line booking-budget-input"
                    type="text"
                    inputMode="numeric"
                    value={budget}
                    onChange={onBudgetChange}
                    placeholder="150000"
                    disabled={budgetDiscuss}
                    aria-label="Бюджет до"
                  />
                  <div className="booking-budget-spin">
                    <button
                      type="button"
                      className="booking-budget-spin-btn"
                      onClick={() => bumpBudget(BUDGET_STEP)}
                      disabled={budgetDiscuss}
                      aria-label="Увеличить бюджет"
                    >
                      <img
                        src="/images/chevronDownList.svg"
                        alt=""
                        className="booking-budget-spin-icon booking-budget-spin-icon--up"
                      />
                    </button>
                    <button
                      type="button"
                      className="booking-budget-spin-btn"
                      onClick={() => bumpBudget(-BUDGET_STEP)}
                      disabled={budgetDiscuss}
                      aria-label="Уменьшить бюджет"
                    >
                      <img
                        src="/images/chevronDownList.svg"
                        alt=""
                        className="booking-budget-spin-icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <BookingCheck
                checked={budgetDiscuss}
                onChange={(e) => {
                  setBudgetDiscuss(e.target.checked)
                  if (e.target.checked) setBudget('')
                }}
              >
                <span>обсудим</span>
              </BookingCheck>
            </div>
          </div>

          <div className="booking-row booking-row--top">
            <span className="booking-label">Референсы</span>
            <ClearableField
              as="textarea"
              inputRef={refsAreaRef}
              className="booking-textarea"
              rows={3}
              value={refs}
              onChange={(e) => setRefs(e.target.value)}
              onClear={() => setRefs('')}
              placeholder="Ссылка на Pinterest или описание стиля"
            />
          </div>

          <div className="booking-row booking-row--date">
            <span className="booking-label">Дата празднования</span>
            <p className="booking-date-value">{formatDate(date)}</p>
          </div>

          <h2 className="booking-heading booking-heading--contacts">
            Контакты
          </h2>

          <div className="booking-row booking-row--line">
            <span className="booking-label">Имя</span>
            <ClearableField
              className="booking-input-line"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClear={() => setName('')}
              placeholder="Анна"
              autoComplete="name"
              required
            />
          </div>

          <div className="booking-row booking-row--line">
            <span className="booking-label">Телефон</span>
            <ClearableField
              className="booking-input-line"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={onPhoneChange}
              onClear={() => setPhone('+7')}
              hasValue={phoneDigits(phone).length > 1}
              placeholder="+7(900)-000-00-00"
              onFocus={() => {
                if (!phone) setPhone('+7')
              }}
              autoComplete="tel"
              required
              pattern="\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}"
              title="Формат: +7(918)-126-76-33"
            />
          </div>

          <div className="booking-consent">
            <span>
              Даю согласие на обработку{' '}
              <Link to="/privacy" className="booking-consent-link">
                персональных данных
              </Link>
            </span>
            <BookingCheck
              className="booking-check--consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
          </div>

          {submitError ? (
            <p className="booking-status booking-status--error" role="alert">
              {submitError}
            </p>
          ) : null}
          {submitOk ? (
            <p className="booking-status booking-status--ok" role="status">
              Заявка отправлена. Дата забронирована.
            </p>
          ) : null}

          <div className="booking-actions">
            <button
              type="submit"
              className="btn btn-booking booking-submit"
              disabled={submitting}
            >
              {submitting ? 'Отправка…' : 'Отправить заявку'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default BookingForm
