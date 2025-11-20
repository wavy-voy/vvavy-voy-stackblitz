'use client';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dharnuji1/image/upload';

const buildFrameSequence = (
  folder: string,
  prefix: string,
  frameCount: number,
  digits: number = 2
) => {
  const folderPath = folder ? `${folder}/` : '';
  return Array.from({ length: frameCount }, (_, index) => {
    const frameNumber = String(index + 1).padStart(digits, '0');
    return `${CLOUDINARY_BASE}/${folderPath}${prefix}${frameNumber}.webp`;
  });
};

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MobileNav.module.scss';
import clsx from 'clsx';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationTarget, setAnimationTarget] = useState(false);

  // Static menu icon (first frame of the animation)
  const staticMenuIcon = 'https://res.cloudinary.com/dharnuji1/image/upload/menu_unf_00000001.webp';

  const staticOpenMenuIcon = 'https://res.cloudinary.com/dharnuji1/image/upload/menu_unf_00000035.webp';

  // Animated PNG sequence from Cloudinary
  const menuFrames = Array.from({ length: 35 }, (_, index) =>
    `https://res.cloudinary.com/dharnuji1/image/upload/menu_unf_000000${String(index + 1).padStart(2, '0')}.webp`
  );

  // Use the same frames as menuFrames but in reverse order for closing
  const closeFrames = [...menuFrames].reverse();

  const toggle = () => {
    if (isAnimating) return;
    
    const newState = !open;
    setIsAnimating(true);
    setAnimationTarget(newState);
    setOpen(newState);
    animateIcon(newState);
  };

  const close = () => {
    if (isAnimating) return;
    setAnimationTarget(false);
    setIsAnimating(true);
    setOpen(false);
    animateIcon(false);
  };

  const animateIcon = (toOpen: boolean) => {
    // Use menuFrames when opening, closeFrames when closing
    const frames = toOpen ? menuFrames : closeFrames;
    const totalFrames = frames.length;
    let startTime: number | null = null;
    const duration = 1000; // 500ms total duration
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Apply ease-out effect (starts fast, ends slow)
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      
      // Calculate frame based on eased progress
      const frameIndex = Math.floor(easedProgress * (totalFrames - 1));
      setCurrentFrame(frameIndex);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setIsAnimating(false);
        // Set to last frame of the current animation
        setCurrentFrame(frames.length - 1);
      }
    };

    // Start from the first frame
    setCurrentFrame(0);
    // Start the animation with requestAnimationFrame to get the timestamp
    requestAnimationFrame(animate);
  };

  // Show animation when in progress, otherwise show the appropriate frame
  const currentImageSrc = (() => {
    if (isAnimating) {
      const frames = animationTarget ? menuFrames : closeFrames;
      return frames[Math.min(currentFrame, frames.length - 1)];
    }

    return open ? staticOpenMenuIcon : staticMenuIcon;
  })();

  return (
    <div className={clsx(styles.container, { [styles.containerActive]: open })}>
      <button 
        onClick={toggle} 
        className={styles.icon}
        disabled={isAnimating}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <Image
          src={currentImageSrc}
          alt=""
          width={384}
          height={100}
          className={styles.animatedIcon}
          style={{
            width: 'auto',
            height: '75%',
            maxHeight: '100%', 
            objectFit: 'contain',
            transition: 'opacity 0.2s ease',
            opacity: isAnimating ? 1 : 0.9
          }}
          priority
        />
      </button>

      {open && (
        <nav className={styles.dropdown}>
          <Link href="/" onClick={close} className={styles.link}>home</Link>
          <Link href="/services" onClick={close} className={clsx(styles.link, styles.disabledLink)} aria-disabled>services</Link>
          <Link href="/work" onClick={close} className={styles.link}>work</Link>
          <Link href="/about" onClick={close} className={styles.link}>about</Link>
        </nav>
      )}
    </div>
  );
}