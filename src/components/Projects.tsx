'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { flagshipProjects, additionalBuilds } from '@/data/projects';

export default function Projects() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setVisibleCards((prev) => new Set(prev).add(id));
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const registerCard = (id: string) => (el: HTMLAnchorElement | null) => {
    if (el && observerRef.current) {
      el.id = `project-${id}`;
      observerRef.current.observe(el);
    }
  };

  return (
    <section id="projects" aria-labelledby="projects-heading">
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
            ref={registerCard(project.slug)}
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
          {additionalBuilds.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`project-card ${visibleCards.has(`project-${project.slug}`) ? 'visible' : ''}`}
              role="listitem"
              ref={registerCard(project.slug)}
            >
              <div className="project-img-placeholder" aria-hidden="true">
                <div className="proj-icon">{project.icon}</div>
              </div>
              <div className="project-meta">
                <div className="project-num">EXPERIMENTAL</div>
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
      </div>
    </section>
  );
}