'use client';

import React, { useState, useEffect, use } from 'react';
import { ProjectProvider, useProject } from '@/lib/ProjectContext';
import PhaseNav from '@/components/PhaseNav';
import WriterRoom from '@/components/WriterRoom';
import CastingRoom from '@/components/CastingRoom';
import StoryboardPanel from '@/components/StoryboardPanel';
import RenderRoom from '@/components/RenderRoom';

function StudioContent() {
  const { currentPhase } = useProject();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col pb-20">
      <PhaseNav />

      <div className="flex-1 max-w-[1800px] w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* PHASE 1: WRITER'S ROOM */}
        {currentPhase === 1 && <WriterRoom />}

        {/* PHASE 2 & 3: CASTING AND STORYBOARD */}
        {currentPhase >= 2 && currentPhase <= 3 && (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in">
            <CastingRoom />
            <div className="col-span-9">
              <StoryboardPanel />
            </div>
          </div>
        )}

        {/* PHASE 4: REMOTION RENDER */}
        {currentPhase === 4 && <RenderRoom />}
      </div>
    </div>
  );
}

export default function StudioPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = decodeURIComponent(resolvedParams.projectId);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <ProjectProvider projectId={projectId}>
      <StudioContent />
    </ProjectProvider>
  );
}
