const STORAGE_KEY = 'billManager.session'

function decodePayload(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

  return JSON.parse(atob(padded))
}

function expiryOf(token) {
  try {
    const payload = decodePayload(token.split('.')[1])
    return typeof payload.exp === 'number' ? payload.exp * 1000 : 0
  } catch {
    return 0
  }
}

export function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const session = JSON.parse(raw)

    if (!session.token || expiryOf(session.token) <= Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    return session
  } catch {
    return null
  }
}

export function saveSession(session) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    return true
  } catch {
    return false
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
