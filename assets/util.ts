import qs from 'query-string'
import SparkMD5 from 'spark-md5'

export function escapeRegExp (s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function normalizeArray<T> (it: T | T[]): T | undefined {
  if (Array.isArray(it)) {
    return it[0]
  }

  return it
}

export function getGravatarUrl (email?: string, size?: number) {
  return `https://www.gravatar.com/avatar/${email ? SparkMD5.hash(email.trim().toLocaleLowerCase()) : '0'}?${qs.stringify({
    s: size,
    d: 'robohash'
  })}`
}
