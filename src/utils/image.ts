export const IMAGE_WIDTHS = [256, 384, 640, 750, 828, 1080, 1200, 1920] as const

export type ImageWidth = (typeof IMAGE_WIDTHS)[number]
export type ImageQuality = 50 | 75 | 90

export function getOptimizedImageUrl(
  src: string,
  width: number,
  quality: ImageQuality = 75,
): string {
  if (import.meta.env.DEV) return src
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

export function buildSrcSet(
  src: string,
  widths: readonly number[],
  quality: ImageQuality = 75,
): string {
  if (import.meta.env.DEV) return ''
  return widths
    .map(w => `${getOptimizedImageUrl(src, w, quality)} ${w}w`)
    .join(', ')
}

export const IMAGE_PRESETS = {
  thumbnail: {
    widths: [256, 384] as const,
    quality: 50 as const,
    sizes: '120px',
  },
  card: {
    widths: [384, 640, 750, 828] as const,
    quality: 75 as const,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  carousel: {
    widths: [640, 828, 1080, 1200, 1920] as const,
    quality: 75 as const,
    sizes: '(max-width: 768px) 100vw, 50vw',
  },
  hero: {
    widths: [828, 1080, 1200, 1920] as const,
    quality: 90 as const,
    sizes: '100vw',
  },
  gallery: {
    widths: [384, 640, 750, 828, 1080] as const,
    quality: 75 as const,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
} as const
