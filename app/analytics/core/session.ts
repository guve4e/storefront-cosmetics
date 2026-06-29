const SESSION_KEY = 'ava_analytics_session_id'

function createSessionId() {
  return `ava_${Date.now()}_${crypto.randomUUID()}`
}

export function getSessionId() {
  if (!import.meta.client) return 'server'

  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const sessionId = createSessionId()
  localStorage.setItem(SESSION_KEY, sessionId)
  return sessionId
}

export function resetSession() {
  if (!import.meta.client) return
  localStorage.removeItem(SESSION_KEY)
}
