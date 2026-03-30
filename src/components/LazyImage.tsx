import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IMAGE_PRESETS, buildSrcSet, getOptimizedImageUrl, type ImageQuality } from '../utils/image';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  imgClassName?: string;
  priority?: boolean;
  preset?: keyof typeof IMAGE_PRESETS;
  quality?: ImageQuality;
}

export default function LazyImage({
  src,
  alt,
  containerClassName = '',
  imgClassName = '',
  priority = false,
  preset,
  quality,
  sizes: sizesOverride,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load slightly before it comes into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const presetConfig = preset ? IMAGE_PRESETS[preset] : null;
  const effectiveQuality = (quality ?? presetConfig?.quality ?? 75) as ImageQuality;
  const effectiveSizes = sizesOverride ?? presetConfig?.sizes;
  const effectiveSrcSet = presetConfig
    ? buildSrcSet(src, presetConfig.widths, effectiveQuality)
    : undefined;
  const effectiveSrc = presetConfig
    ? getOptimizedImageUrl(src, presetConfig.widths[Math.floor(presetConfig.widths.length / 2)], effectiveQuality)
    : src;

  return (
    <div className={`relative overflow-hidden bg-transparent ${containerClassName}`} ref={containerRef}>
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-white/10 z-0"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {isInView && (
        <img
          src={effectiveSrc}
          srcSet={effectiveSrcSet || undefined}
          sizes={effectiveSizes || undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority && { fetchPriority: 'high' as const })}
          className={`w-full h-full transition-opacity duration-700 z-10 relative ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          onLoad={() => setIsLoaded(true)}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
}
