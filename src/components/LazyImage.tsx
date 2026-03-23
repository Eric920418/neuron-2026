import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  imgClassName?: string;
  priority?: boolean;
}

export default function LazyImage({ 
  src, 
  alt, 
  containerClassName = '', 
  imgClassName = '', 
  priority = false,
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

  return (
    <div className={`relative overflow-hidden bg-white/5 ${containerClassName}`} ref={containerRef}>
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-white/10 z-0"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority && { fetchPriority: 'high' as const })}
          className={`w-full h-full object-cover transition-opacity duration-700 z-10 relative ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          onLoad={() => setIsLoaded(true)}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
}
