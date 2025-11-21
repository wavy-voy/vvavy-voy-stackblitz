// hooks/useScrollProgress.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rafId = useRef<number>();
  const sectionTop = useRef(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Update section top position on first scroll
    if (sectionTop.current === 0 && rect.top > 0) {
      sectionTop.current = rect.top + scrollY;
      return;
    }

    // Calculate progress based on scroll position relative to section
    const sectionStart = sectionTop.current - viewportHeight;
    const sectionEnd = sectionTop.current;
    const scrollPosition = Math.max(0, scrollY - sectionStart);
    const sectionHeight = sectionEnd - sectionStart;
    
    const raw = Math.min(1, Math.max(0, scrollPosition / sectionHeight));
    
    setRawProgress(raw);
    setProgress(raw);
    
    rafId.current = requestAnimationFrame(handleScroll);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const getProgressValue = (start: number, end: number) => {
    return start + (end - start) * progress;
  };

  return { 
    progress,
    rawProgress,
    sectionRef,
    getProgressValue 
  };
};

export default useScrollProgress;