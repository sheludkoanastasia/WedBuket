const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function ensureApiUrl() {
  if (!API_URL) {
    throw new Error('Не задан VITE_API_URL')
  }
  return API_URL
}

async function apiFetch(pathWithQuery, options = {}) {
  const base = ensureApiUrl()
  const res = await fetch(`${base}${pathWithQuery}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }

  if (!res.ok || data?.error || data?.success === false) {
    const message =
      data?.error ||
      data?.details?.meta?.message ||
      data?.meta?.message ||
      text ||
      res.statusText ||
      'Ошибка запроса'
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

/** @returns {Promise<string[]>} YYYY-MM-DD */
export async function fetchBookingDates() {
  const data = await apiFetch('?action=dates')
  return data?.data?.booking_dates || []
}

/** @returns {Promise<{ time: string, datetime: string, seance_length: number } | null>} */
export async function fetchBookingTime(dateIso) {
  const data = await apiFetch(
    `?action=times&date=${encodeURIComponent(dateIso)}`
  )
  const slots = data?.data || []
  return slots[0] || null
}

export async function createBooking(payload) {
  return apiFetch('?action=book', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function toIsoDate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
