'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { flagshipProjects, additionalBuilds } from '@/data/projects';

export default function Projects() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLAnchorElement>('[data-project-id]'));
    
    // Immediate visibility fallback for cards already in viewport or if IntersectionObserver unavailable
    const checkInitialVisibility = () => {
      cards.forEach((card) => {
        const id = card.dataset.projectId;
        if (!id) return;
        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          setVisibleCards((prev) => new Set(prev).add(id));
        }
      });
    };

    // Check immediately on mount
    checkInitialVisibility();

    // Also check on scroll (for back-navigation)
    window.addEventListener('scroll', checkInitialVisibility, { passive: true });

    if (!('IntersectionObserver' in window)) {
      // Fallback: make all visible if IntersectionObserver not supported
      cards.forEach((card) => {
        const id = card.dataset.projectId;
        if (id) setVisibleCards((prev) => new Set(prev).add(id));
      });
      return () => window.removeEventListener('scroll', checkInitialVisibility);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.projectId;
            if (id) {
              setVisibleCards((prev) => new Set(prev).add(id));
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    cards.forEach((card) => observerRef.current?.observe(card));

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', checkInitialVisibility);
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} aria-labelledby="projects-heading">
      <div className="section-header">
        <p className="section-label">ACTIVE OPERATIONS</p>
        <h2 id="projects-heading" className="section-title">PROJECTS</h2>
        <div className="section-line" aria-hidden="true" />
      </div>

      {/* Flagship Projects */}
      <div className="projects-grid" role="list" aria-label="Flagship projects">
        {flagshipProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`project-card ${visibleCards.has(`project-${project.slug}`) ? 'visible' : ''}`}
            role="listitem"
            data-project-id={`project-${project.slug}`}
          >
            <div className="project-img-placeholder" aria-hidden="true">
              <div className="proj-icon">{project.icon}</div>
            </div>
            <div className="project-meta">
              <div className="project-num">PROJECT_{project.num}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Builds */}
      <div className="additional-builds">
        <p className="additional-builds-label">ADDITIONAL BUILDS</p>
        <div className="additional-grid" role="list" aria-label="Additional builds">
          {additionalBuilds.map((project) => {
            const statusLabel = project.slug === 'cyber-virtual-mouse' ? 'RELEASED' : 'DAILY DRIVER';
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`project-card ${visibleCards.has(`project-${project.slug}`) ? 'visible' : ''}`}
                role="listitem"
                data-project-id={`project-${project.slug}`}
              >
                <div className="project-img-placeholder" aria-hidden="true">
                  <div className="proj-icon">{project.icon}</div>
                </div>
                <div className="project-meta">
                  <div className="project-num">{statusLabel}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}