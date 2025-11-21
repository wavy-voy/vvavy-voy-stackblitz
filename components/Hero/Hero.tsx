// components/Hero/Hero.tsx
'use client';

import { useRef } from 'react';
import AnimatedLetters from '../AnimatedLetters/AnimatedLetters';
import styles from './Hero.module.scss';

const brandLetters = ['V', 'V', 'A', 'V', 'Y'];

interface HeroProps {
  progress: number;
}

export const Hero = ({ progress }: HeroProps) => {
  // Utility function to map progress to values
  const getProgressValue = (start: number, end: number) => {
    return start + (end - start) * progress;
  };

  // Utility function for delayed progress (starts at 0.1)
  const getDelayedProgressValue = (start: number, end: number) => {
    const delayedProgress = progress < 0.1 ? 0 : Math.min(1, (progress - 0.1) / 0.9);
    return start + (end - start) * delayedProgress;
  };

  // Two colors to blend between
  const col1 = 'rgba(0, 30, 50, 1)'; // Start color (dark blue)
  const col2 = 'rgba(77, 113, 176, 1)'; // End color (lighter blue)

  // Parse colors once (optimization)
  const parseColor = (color: string) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    return match ? {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    } : { r: 0, g: 0, b: 0 };
  };

  const color1 = parseColor(col1);
  const color2 = parseColor(col2);

  // Optimized lerp function using pre-parsed colors
  const lerpColor = (c1: typeof color1, c2: typeof color2, t: number) => {
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Get the blended background color based on delayed progress
  const getBackgroundColor = () => {
    const delayedProgress = progress < 0.1 ? 0 : Math.min(1, (progress - 0.1) / 0.9);
    return lerpColor(color1, color2, delayedProgress);
  };

  // Text animation
  const textOpacity = progress;
  const textY = getProgressValue(30, 0);

  return (
    <article className={styles.container}
      style={{
        backgroundColor: getBackgroundColor(),
        transition: 'background-color 0.1s ease-out',
        position: 'relative'
      }}
    >
      <AnimatedLetters
        progress={progress}
        letters={brandLetters}
      />
      <div
        className={styles.textGroup}
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          transition: 'opacity 0.2s ease-out, transform 0.3s ease-out'
        }}
      >
        <p>Visuals powered by algorithms.</p>
        <p>Animation, 3D rendering and simulation.</p>
        <p>Creative production that push boundaries of imagination.</p>
      </div>

      {/* Large debug display - COMMENTED OUT */}
      {/* {progress > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          fontSize: '36px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          zIndex: 10,
          minWidth: '250px',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div>{Math.round(progress * 100)}%</div>
          <div style={{ fontSize: '16px', opacity: 0.7, marginTop: '5px' }}>
            Ultra Smooth Progress
          </div>
        </div>
      )} */}
    </article>
  );
};