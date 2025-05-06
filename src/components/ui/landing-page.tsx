'use client';

import { useEffect, useState } from 'react';
import { SplineSceneBasic } from './spline-scene-basic';
import { RobotBackground } from './robot-background';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(true);
  
  const subtitleWords = ['amazing', 'new', 'powerful', 'unique', 'innovative', 'groundbreaking'];

  useEffect(() => {
    // Add a slight delay to ensure smooth animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Set up subtitle rotation with fade effect
    const subtitleInterval = setInterval(() => {
      // Fade out
      setSubtitleVisible(false);
      
      // Change word after fade out
      setTimeout(() => {
        setSubtitleIndex(prevIndex => (prevIndex + 1) % subtitleWords.length);
        // Fade in
        setSubtitleVisible(true);
      }, 500);
      
    }, 2000);
    
    return () => clearInterval(subtitleInterval);
  }, [subtitleWords.length]);

  const handleGetStarted = () => {
    router.push('/chat');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background */}
      <RobotBackground />
      
      {/* Content Container */}
      <div 
        className={`
          flex flex-col items-center justify-center max-w-6xl w-full px-4 sm:px-6 transition-all duration-1000 transform
          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        {/* Title with animated gradient */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white animate-gradient-x bg-[length:200%_100%]">
            Prompt Engineering
          </span>
        </h1>
        
        {/* Changing Subtitle */}
        <div className="mb-20 flex items-center justify-center">
          <p className="text-xl md:text-2xl text-white text-center">
            This is something{" "}
            <span 
              className={`
                font-bold inline-block min-w-28 text-center
                transition-all duration-500
                ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
              `}
            >
              {subtitleWords[subtitleIndex]}
            </span>
          </p>
        </div>
        
        {/* 3D Robot Component */}
        <div className="w-full max-w-3xl aspect-[16/9] mb-16">
          <SplineSceneBasic />
        </div>
        
        {/* Extra spacing */}
        <div className="mt-10"></div>
        
        {/* Animated Button Container */}
        <div className="relative">
          {/* Button Glow Effect */}
          <div 
            className={`
              absolute inset-0 bg-white/5 rounded-full blur-xl transition-opacity duration-500
              ${isButtonHovered ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}
            `}
          />
          
          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="
              relative px-8 py-4 text-lg font-medium rounded-full
              bg-gradient-to-r from-white/20 to-white/5
              border border-white/10
              hover:border-white/30 hover:from-white/30 hover:to-white/10
              transform hover:scale-105 active:scale-95
              transition-all duration-300 ease-in-out
              shadow-lg hover:shadow-white/10
              focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black
            "
          >
            Let's Get Started
            
            {/* Arrow Animation */}
            <span 
              className={`
                inline-block ml-2 transition-transform duration-300
                ${isButtonHovered ? 'translate-x-1' : 'translate-x-0'}
              `}
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 