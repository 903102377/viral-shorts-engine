'use client';

import React, { useState, useEffect } from 'react';
import ProjectList from '@/components/ProjectList';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return <ProjectList />;
}
