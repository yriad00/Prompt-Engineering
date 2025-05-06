'use client';

import { useEffect, useRef } from 'react';

export function RobotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const robotTexts = [
      "10101", "ROBOT", "AI", "SYSTEM", "COMPUTE", "DATA", "NEURAL", 
      "MACHINE", "LEARN", "CODE", "ALGO", "BINARY", "NETWORK",
      "CYBER", "LOGIC", "PROCESS", "FUNCTION", "EXECUTE"
    ];
    
    const columns = Math.floor(canvas.width / 20);
    const rows = Math.floor(canvas.height / 20);
    const positions = Array(columns).fill(0);
    
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < columns; i++) {
        const text = robotTexts[Math.floor(Math.random() * robotTexts.length)];
        const x = i * 20;
        const y = positions[i] * 20;
        
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          positions[i] = 0;
        } else {
          positions[i]++;
        }
      }
    };
    
    const interval = setInterval(drawMatrix, 50);
    
    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-20"
    />
  );
} 