'use client';

import { useEffect, useRef, useState } from 'react';
import { skillCategories } from '@/data/skills';

export default function Skills() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLDivElement>('[data-skill-id]'));
    
    // Immediate visibility fallback for cards already in viewport or if IntersectionObserver unavailable
    const checkInitialVisibility = () => {
      cards.forEach((card) => {
        const id = card.dataset.skillId;
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
        const id = card.dataset.skillId;
        if (id) setVisibleCards((prev) => new Set(prev).add(id));
      });
      return () => window.removeEventListener('scroll', checkInitialVisibility);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.skillId;
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
    <section id="skills" ref={sectionRef} aria-labelledby="skills-heading">
      <div className="section-header">
        <p className="section-label">SKILL MATRIX</p>
        <h2 id="skills-heading" className="section-title">CAPABILITIES</h2>
        <div className="section-line" aria-hidden="true" />
      </div>

      {skillCategories.map((category, catIndex) => (
        <div key={category.label} className="skills-category">
          <p className="category-label">{category.label}</p>
          <div className="skills-grid" role="list">
            {category.skills.map((skill, index) => {
              const cardId = `${category.label}-${index}`;
              return (
                <div
                  key={`${category.label}-${skill.name}`}
                  className={`skill-card ${visibleCards.has(cardId) ? 'visible' : ''}`}
                  role="listitem"
                  data-skill-id={cardId}
                  style={{ transitionDelay: `${index * 0.06}s` }}
                >
                  <div className="skill-icon" aria-hidden="true">{skill.icon}</div>
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-tag">{skill.tag}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}