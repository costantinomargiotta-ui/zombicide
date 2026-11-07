import type { ReactNode } from 'react';
import { useImageUrl } from '../../data/hooks';

export function StoredImage({ imageId, alt, className, fallback }: { imageId?: string; alt: string; className?: string; fallback: ReactNode }) {
  const url = useImageUrl(imageId);
  return url ? <img src={url} alt={alt} className={className} /> : <>{fallback}</>;
}
