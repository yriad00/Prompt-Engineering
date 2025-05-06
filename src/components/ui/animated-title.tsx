'use client';

import { useEffect, useState } from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
}

export function AnimatedTitle({ text, className = '' }: AnimatedTitleProps) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <h1 
      className={`${className} transform transition-all duration-1000 ${
        visible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      {text}
    </h1>
  );
} 