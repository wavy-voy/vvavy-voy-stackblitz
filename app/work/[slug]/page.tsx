'use client';

import { redirect, useParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { projectRegistry } from '@/data/projectRegistry';
import ProjectSection from '@/components/ProjectSection/ProjectSection';
import { Footer } from '@/components/Footer/Footer';
import dynamic from 'next/dynamic';

const ReactFullpage = dynamic(() => import('@fullpage/react-fullpage'), {
  ssr: false,
});

export default function ProjectPage() {
  const { slug } = useParams();
  const project = useMemo(
    () => slug && projectRegistry[slug as string],
    [slug]
  );

  const fullpageApiRef = useRef<any>(null);

  useEffect(() => {
    // Scroll to first section on mount (page revisit)
    if (fullpageApiRef.current) {
      fullpageApiRef.current.moveTo(1);
    }
  }, []);


  if (!project) return redirect("/projects");

  return (
    <ReactFullpage
      credits={{ enabled: false }}
      scrollingSpeed={1000}
      navigation
      render={({ state, fullpageApi }) => {
        fullpageApiRef.current = fullpageApi; // assign to ref
        return (<div id="fullpage-wrapper">
          {project.gallery.map((section, index) => (
            <ProjectSection key={index} section={section} />
          ))}
          <div className="section">
            <Footer />
          </div>
        </div>)
      }}
    />
  );
}
