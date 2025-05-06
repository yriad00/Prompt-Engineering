'use client';

import { useState, useEffect } from 'react';

interface ChangingSubtitleProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function ChangingSubtitle({ 
  words = ['amazing', 'new', 'powerful', 'unique'],
  interval = 2000, 
  className = ''
}: ChangingSubtitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const fadeTimeout = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 500); // Half a second to change the word during fade out
      
    }, interval);
    
    return () => clearInterval(fadeTimeout);
  }, [interval, words.length]);
  
  return (
    <div className={`${className}`}>
      This is something <span 
        className={`inline-block min-w-[100px] text-center transition-all duration-500 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-3'
        }`}
      >
        {words[currentIndex]}
      </span>
    </div>
  );
} 