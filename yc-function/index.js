

const YC_BASE = 'https://api.yclients.com/api/v1'

const ALLOWED_ORIGINS = [
  'https://wedbuket.website.yandexcloud.net',
  'http://wedbuket.website.yandexcloud.net',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function requestOrigin(event) {
  const headers = event?.headers || {}
  return headers.origin || headers.Origin || ''
}

function corsHeaders(event) {
  const origin = requestOrigin(event)
  const allowOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function json(statusCode, data, event) {
  return {
    statusCode,
    headers: corsHeaders(event),
    body: JSON.stringify(data),
  }
}

function ycHeaders() {
  return {
    Accept: 'application/vnd.api.v2+json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.YCLIENTS_PARTNER_TOKEN}, User ${process.env.YCLIENTS_USER_TOKEN}`,
  }
}

function getPathAndQuery(event) {
  const url = event.url || ''
  const qs = event.queryStringParameters || {}
  let path = ''
  try {
    if (url) path = new URL(url).pathname || ''
  } catch (_) {
    /* ignore */
  }
  if (event.path) path = event.path
  return {
    path,
    qs,
    method: (
      event.httpMethod ||
      event.requestContext?.httpMethod ||
      'GET'
    ).toUpperCase(),
  }
}

function parseBody(event) {
  if (!event.body) return {}
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return {}
  }
}

async function ycFetch(path, options = {}) {
  const res = await fetch(`${YC_BASE}${path}`, {
    ...options,
    headers: { ...ycHeaders(), ...(options.headers || {}) },
  })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    const err = new Error(
      data?.meta?.message || data?.error || text || res.statusText
    )
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

module.exports.handler = async function (event) {
  const { path, qs, method } = getPathAndQuery(event)

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(event), body: '' }
  }

  const companyId = process.env.YCLIENTS_COMPANY_ID
  const staffId = process.env.YCLIENTS_STAFF_ID
  const serviceId = process.env.YCLIENTS_SERVICE_ID
  const action = (qs.action || '').toLowerCase()

  try {
    if (method === 'GET' && (action === 'dates' || path.endsWith('/dates'))) {
      const data = await ycFetch(
        `/book_dates/${companyId}?service_ids[]=${serviceId}&staff_id=${staffId}`
      )
      return json(200, data, event)
    }

    if (method === 'GET' && (action === 'times' || path.endsWith('/times'))) {
      const date = qs.date
      if (!date) return json(400, { error: 'date required (YYYY-MM-DD)' }, event)
      const data = await ycFetch(
        `/book_times/${companyId}/${staffId}/${date}?service_ids[]=${serviceId}`
      )
      return json(200, data, event)
    }

    if (
      method === 'POST' &&
      (action === 'book' || action === '' || path.endsWith('/book'))
    ) {
      const body = parseBody(event)
      const phone = String(body.phone || '').replace(/\D/g, '')
      const customFields = body.custom_fields || {}

      const appointment = {
        id: 1,
        services: [Number(serviceId)],
        staff_id: Number(staffId),
        datetime: body.datetime,
        custom_fields: {
          event_type: customFields.event_type || '',
          venue: customFields.venue || '',
          extras: customFields.extras || '',
          bouquet: customFields.bouquet || '',
          budget: customFields.budget || '',
          refs: customFields.refs || '',
        },
      }

      const payload = {
        phone,
        fullname: body.name || body.fullname || 'Клиент',
        email: body.email || 'client@example.com',
        comment: body.comment || 'Заявка с сайта WedBuket',
        appointments: [appointment],
      }

      if (!payload.appointments[0].datetime) {
        return json(400, { error: 'datetime required' }, event)
      }
      if (!phone) {
        return json(400, { error: 'phone required' }, event)
      }

      const data = await ycFetch(`/book_record/${companyId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return json(200, data, event)
    }

    return json(
      200,
      {
        ok: true,
        message: 'yclients-api works',
        hint: 'Use ?action=dates | ?action=times&date=YYYY-MM-DD | POST ?action=book',
      },
      event
    )
  } catch (e) {
    return json(
      e.status || 500,
      {
        error: e.message,
        details: e.data || null,
      },
      event
    )
  }
}
