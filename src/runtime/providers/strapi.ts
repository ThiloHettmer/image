import { withBase } from 'ufo'
import type { ProviderGetImage, ResolvedImage } from '../../module'

export const getImage: ProviderGetImage = (
  src: string,
  { modifiers, baseURL = 'http://localhost:1337/uploads' } = {},
): ResolvedImage => {
  const breakpoint
    = modifiers?.breakpoint ?? undefined
  const formats = modifiers?.formats

  const path = src.startsWith('/uploads/')
    ? src.slice(9)
    : src

  if (!breakpoint || !formats) {
    return {
      url: withBase(path, baseURL),
    }
  }

  const breakpoints = ['large', 'medium', 'small', 'thumbnail'] as const

  const startIndex = breakpoints.indexOf(breakpoint)

  for (let i = startIndex; i < breakpoints.length; i++) {
    const size = breakpoints[i]
    const format = formats[size as typeof breakpoints[number]]

    if (format?.url) {
      const formatPath = format.url.startsWith('/uploads/')
        ? format.url.slice(9)
        : format.url

      return {
        url: withBase(formatPath, baseURL),
      }
    }
  }

  return {
    url: withBase(path, baseURL),
  }
}
