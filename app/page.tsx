'use client';

import ArtTechSection from '@/components/ArtTechSection/ArtTechSection';
import { Footer } from '@/components/Footer/Footer';
import { Hero } from '@/components/Hero/Hero';
import VideoSection from '@/components/VideoSection/VideoSection';
import dynamic from 'next/dynamic';
import React from 'react';
import { useEffect, useRef, useState } from 'react';

const ReactFullpage = dynamic(() => import('@fullpage/react-fullpage'), {
  ssr: false,
});

const videoSources = [
  // 'https://res.cloudinary.com/dharnuji1/video/upload/v1761379367/SORT_BUILDING_V6_RENDER_DARK.V2_16x9_Infinite_build_cam_16x19_2._0120-0240__3_V1-0003_crf25_width1920_od7ada.webm',
  'https://res.cloudinary.com/dharnuji1/video/upload/10sec_opener_crf35_width1920_k0yw28.webm',
  'https://res.cloudinary.com/dharnuji1/video/upload/v1761378779/LaPalma_deLasPalmas_V4_matV1_2_RENDER_cam5_V2.cam5_V2._0130-0260_00000000-00000130_00000588_crf35_width1920_kni6wj.webm',
  'https://res.cloudinary.com/dharnuji1/video/upload/v1761379187/LaPalmaV1_061625_V04_RENDER_5.cam2._0072-0168_00000000-00000096__8_00000000_crf30_width1920_ir1mvn.webm',
];

export default function Home() {
  const [heroProgress, setHeroProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const fullpageApiRef = useRef<any>(null);

  useEffect(() => {
    // Smooth progress transition with easing
    let animationId: number;
    
    const animateProgress = () => {
      setSmoothProgress(prev => {
        const diff = heroProgress - prev;
        // Use cubic ease-out for very smooth transitions
        const t = Math.min(Math.abs(diff) / 1.0, 1.0); // Normalize to 0-1
        const easedT = 1 - Math.pow(1 - t, 3); // Cubic ease-out
        const step = diff * 0.03 * (1 + easedT); // Adaptive speed based on distance
        
        if (Math.abs(diff) < 0.0005) {
          return heroProgress;
        }
        return prev + step;
      });
      animationId = requestAnimationFrame(animateProgress);
    };

    animationId = requestAnimationFrame(animateProgress);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [heroProgress]);

  useEffect(() => {
    // Scroll to first section on mount (page revisit)
    if (fullpageApiRef.current) {
      fullpageApiRef.current.moveTo(1);
    }
  }, []);

  return (
    <ReactFullpage
      credits={{}} // required to suppress warning
      scrollingSpeed={1000}
      navigation
      autoScrolling={true} // enables fullpage scrolling
      fitToSection={true} // snap to section
      onLeave={(origin, destination, direction) => {
        // Handle progress changes during section transitions
        if (destination.index === 1) {
          // Entering Hero section
          setHeroProgress(1);
        } else if (origin.index === 1) {
          // Leaving Hero section
          setHeroProgress(0);
        }
      }}
      afterLoad={(origin, destination) => {
        // Ensure progress is set correctly after section load
        if (destination.index === 1) {
          setHeroProgress(1);
        } else if (origin && origin.index === 1) {
          setHeroProgress(0);
        }
      }}
      render={({ state, fullpageApi }) => {
        fullpageApiRef.current = fullpageApi; // assign to ref
        return (
          <div id="fullpage-wrapper">
            <div className="section">
              <VideoSection videoUrl={videoSources[0]} />
            </div>
            <div className="section">
              <Hero progress={smoothProgress} />
            </div>
            <div className="section">
              <VideoSection videoUrl={videoSources[1]} />
            </div>
            <div className="section">
              <ArtTechSection />
            </div>
            <div className="section">
              <VideoSection videoUrl={videoSources[2]} />
            </div>
            <div className="section">
              <Footer />
            </div>
          </div>
        );
      }}
    />
  );
}
