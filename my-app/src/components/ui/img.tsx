'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  (void setCurrent)

  return (
    <Image
      src={images[current]}
      alt="Profile"
      width={128}
      height={128}
      className="w-32 h-32 rounded-full shadow-lg"
    />

  );
}
