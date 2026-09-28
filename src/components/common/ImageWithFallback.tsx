import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  categoryHint?: string;
}

const DEFAULT_FALLBACK = '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Product image',
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  categoryHint,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const resolvedSrc = hasError || !src ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#F5EBE6] animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#5B1423]/20 animate-spin" />
        </div>
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...rest}
      />
    </div>
  );
};
