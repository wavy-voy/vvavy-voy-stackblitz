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
  'https://res.cloudinary.com/dharnuji1/video/upload/v1761379367/SORT_BUILDING_V6_RENDER_DARK.V2_16x9_Infinite_build_cam_16x19_2._0120-0240__3_V1-0003_crf25_width1920_od7ada.webm',
  'https://res.cloudinary.com/dharnuji1/video/upload/v1761378779/LaPalma_deLasPalmas_V4_matV1_2_RENDER_cam5_V2.cam5_V2._0130-0260_00000000-00000130_00000588_crf35_width1920_kni6wj.webm',
  'https://res.cloudinary.com/dharnuji1/video/upload/v1761379187/LaPalmaV1_061625_V04_RENDER_5.cam2._0072-0168_00000000-00000096__8_00000000_crf30_width1920_ir1mvn.webm',
];

export default function Home() {
  const [heroAnimated, setHeroAnimated] = useState(false);

  const fullpageApiRef = useRef<any>(null);

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
      afterLoad={(origin, destination) => {
        if (destination.index === 1 && !heroAnimated) {
          setHeroAnimated(true);
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
              <Hero shouldAnimate={heroAnimated} />
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
