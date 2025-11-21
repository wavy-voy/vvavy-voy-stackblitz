// hooks/useSectionProgress.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SectionProgressHook {
  progress: number;
  isActive: boolean;
  direction: 'entering' | 'leaving' | null;
  getProgressValue: (start: number, end: number) => number;
}

export const useSectionProgress = (sectionIndex: number): SectionProgressHook => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [direction, setDirection] = useState<'entering' | 'leaving' | null>(null);
  const rafId = useRef<number>();
  const startTime = useRef<number>();
  const transitionDuration = 1000; // Match fullpage.js scrollingSpeed

  const animateProgress = useCallback((targetProgress: number, newDirection: 'entering' | 'leaving') => {
    const startProgress = progress;
    startTime.current = Date.now();
    setDirection(newDirection);

    const animate = () => {
      const elapsed = Date.now() - (startTime.current || 0);
      const normalizedTime = Math.min(elapsed / transitionDuration, 1);

      // Easing function for smooth animation
      const easedTime = 1 - Math.pow(1 - normalizedTime, 3); // Cubic ease-out

      const currentProgress = startProgress + (targetProgress - startProgress) * easedTime;
      setProgress(currentProgress);

      if (normalizedTime < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setDirection(null);
      }
    };

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    animate();
  }, [progress]);

  const handleSectionChange = useCallback((origin: any, destination: any) => {
    const isEnteringTargetSection = destination.index === sectionIndex;
    const isLeavingTargetSection = origin.index === sectionIndex;

    if (isEnteringTargetSection && !isActive) {
      // Entering the target section
      setIsActive(true);
      animateProgress(1, 'entering');
    } else if (isLeavingTargetSection && isActive) {
      // Leaving the target section
      setIsActive(false);
      animateProgress(0, 'leaving');
    }
  }, [sectionIndex, isActive, animateProgress]);

  // Listen for fullpage.js events
  useEffect(() => {
    const handleFullpageAfterLoad = (origin: any, destination: any) => {
      handleSectionChange(origin, destination);
    };

    const handleFullpageOnLeave = (origin: any, destination: any, direction: string) => {
      // Handle immediate progress changes during transitions
      handleSectionChange(origin, destination);
    };

    // Add event listeners to window since fullpage.js dispatches events there
    window.addEventListener('fpAfterLoad', handleFullpageAfterLoad as any);
    window.addEventListener('fpOnLeave', handleFullpageOnLeave as any);

    return () => {
      window.removeEventListener('fpAfterLoad', handleFullpageAfterLoad as any);
      window.removeEventListener('fpOnLeave', handleFullpageOnLeave as any);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleSectionChange]);

  // Utility function to map progress to values
  const getProgressValue = useCallback((start: number, end: number) => {
    return start + (end - start) * progress;
  }, [progress]);

  return {
    progress,
    isActive,
    direction,
    getProgressValue
  };
};

export default useSectionProgress;