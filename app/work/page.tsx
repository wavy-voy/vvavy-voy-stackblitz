'use client';

import dynamic from 'next/dynamic';
import VideoSection from '@/components/VideoSection/VideoSection';
import ProjectGrid from '@/components/ProjectGrid/ProjectGrid';
import { Footer } from '@/components/Footer/Footer';
import React, { useRef, useEffect } from 'react';

const ReactFullpage = dynamic(() => import('@fullpage/react-fullpage'), {
  ssr: false,
});

const videoSources = [
  'https://res.cloudinary.com/dharnuji1/video/upload/v1761379367/SORT_BUILDING_V6_RENDER_DARK.V2_16x9_Infinite_build_cam_16x19_2._0120-0240__3_V1-0003_crf25_width1920_od7ada.webm',
];

export default function WorkPage() {
  const fullpageApiRef = useRef<any>(null);

  useEffect(() => {
    // Scroll to first section on mount (page revisit)
    if (fullpageApiRef.current) {
      fullpageApiRef.current.moveTo(1);
    }
  }, []);

  return (
    <ReactFullpage
      credits={{}}
      scrollingSpeed={1000}
      navigation
      autoScrolling={true} // enables fullpage scrolling
      fitToSection={true} // snap to section
    render={({ state, fullpageApi }) => {
      fullpageApiRef.current = fullpageApi; // assign to ref
        return (<div id="fullpage-wrapper">
          <div className="section">
            <VideoSection videoUrl={videoSources[0]} />
          </div>
          <div className="section">
            <ProjectGrid />
          </div>
          <div className="section">
            <Footer />
          </div>
        </div>)
    }}
    />
  );
}
