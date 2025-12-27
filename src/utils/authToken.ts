export interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

const TOKEN_KEY = 'pointquest_admin_jwt'
const USER_KEY = 'pointquest_admin_user'

export function persistToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function persistUser<T extends Record<string, unknown>>(user: T) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function readUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn('Failed to parse cached user', error)
    return null
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function decodeJwt(token: string): JwtPayload | null {
  const [, payload] = token.split('.')
  if (!payload) return null
  try {
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=')
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json) as JwtPayload
  } catch (error) {
    console.warn('Failed to decode JWT payload', error)
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload?.exp) return false
  const now = Date.now() / 1000
  return payload.exp <= now
}

export function getValidToken(): string | null {
  const token = readToken()
  if (!token) return null
  if (isTokenExpired(token)) {
    clearToken()
    return null
  }
  return token
}
