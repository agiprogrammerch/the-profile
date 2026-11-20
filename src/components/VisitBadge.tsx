'use client';

import { useEffect, useState } from 'react';
import { fetchAllRepoStats, getTotalStars } from '@/lib/github';

const REPO_NAMES = ['echobaud', 'phaseveil', 'osint-center', 'tensorgate', 'cyber-virtual-mouse', 'lan-drop'];

export default function VisitBadge() {
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadStars = async () => {
      try {
        const stats = await fetchAllRepoStats(REPO_NAMES);
        if (mounted) {
          setTotalStars(getTotalStars(stats));
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setTotalStars(0);
          setIsLoading(false);
        }
      }
    };

    loadStars();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="visit-badge" role="status" aria-live="polite">
      <div className="counter-ping" aria-hidden="true" />
      <span className="counter-label">GITHUB STARS</span>
      <span className="counter-value" id="visit-count">
        {isLoading ? '...' : totalStars.toLocaleString()}
      </span>
    </div>
  );
}