// components/AnimatedLetters/AnimatedLetters.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './AnimatedLetters.module.scss';

type AnimatedLettersProps = {
  letters: string[];
  progress: number;  // Changed from shouldAnimate to progress
};

export default function AnimatedLetters({ letters, progress }: AnimatedLettersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letterElements = lettersRef.current.filter(Boolean) as HTMLElement[];
    const isSmallScreen = window.innerWidth <= 768;
    const spacing = isSmallScreen ? 55 : 40; // Increased spacing between letters
    
    // Create a timeline if it doesn't exist
    if (!animationRef.current) {
      // Set initial state (all letters stacked on the left)
      gsap.set(letterElements, {
        x: 0,
        opacity: 0,
        scale: 0.8,
      });

      // Create a timeline for the animation
      animationRef.current = gsap.timeline({ 
        paused: true,
        defaults: { 
          ease: "back.out(1.4)",
          duration: 0.8
        }
      });

      // Add animations for each letter
      letterElements.forEach((letter, i) => {
        const targetX = i * spacing;
        const delay = i * 0.15;
        
        animationRef.current?.to(letter, {
          x: targetX,
          opacity: 1,
          scale: 1,
          delay,
        }, 0);
      });
    }

    // Update the timeline progress based on scroll
    if (animationRef.current) {
      // Exponential remapping for letters animation (ease-in: starts slow, ends fast)
      let exponentialProgress;
      if (progress < 0.35) {
        exponentialProgress = 0;
      } else {
        const normalizedProgress = Math.min(1, (progress - 0.5) / 0.5);
        exponentialProgress = Math.pow(normalizedProgress, 2); // ease-in quadratic
      }
      
      animationRef.current.progress(exponentialProgress);
    }

    return () => {
      // Cleanup on unmount
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [progress, letters]);

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.inner}>
        {letters.map((char, i) => (
          <span 
            key={i} 
            ref={el => lettersRef.current[i] = el}
            className={`${styles.letter} ${char === 'V' || char === 'A' || char === 'Y' ? styles.edgeLetter : ''}`}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}