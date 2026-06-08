'use client';
import { useState } from 'react';

interface ProductImageProps {
  id: string;
  name: string;
  category?: string;
  primaryImageUrl?: string;
  className?: string;
}

export default function ProductImage({ id, name, category = '', primaryImageUrl, className = 'w-full h-full object-cover' }: ProductImageProps) {
  const formattedName = name ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase() : 'Product';
  const aiSearchName = formattedName.toLowerCase().replace("drum stick", "moringa vegetable").replace("drumstick", "moringa vegetable").replace("apple", "apple fruit");
  
  const aiGeneratedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiSearchName + " " + (category || 'vegetable') + " raw vegetable fruit agricultural crop field harvest")}?width=800&height=600&nologo=true&seed=${id}`;
  const backupImageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(aiSearchName + " " + category)}&w=400&h=300&c=7&rs=1&p=0`;

  const [imgSrc, setImgSrc] = useState(primaryImageUrl || aiGeneratedImageUrl);
  const [imgError, setImgError] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState(0);

  if (imgError) {
    return <img src={imgSrc} alt={name} className={className} />;
  }

  return (
    <img
      src={imgSrc}
      alt={name}
      className={className}
      onError={() => {
        if (fallbackLevel === 0) {
          setImgSrc(backupImageUrl);
          setFallbackLevel(1);
        } else if (fallbackLevel === 1) {
          setImgSrc(`https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(name || 'Product')}`);
          setFallbackLevel(2);
          setImgError(true);
        }
      }}
    />
  );
}
