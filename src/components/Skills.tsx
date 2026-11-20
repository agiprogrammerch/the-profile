'use client';

import { useEffect, useRef, useState } from 'react';
import { skillCategories } from '@/data/skills';

export default function Skills() {
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

  const registerCard = (id: string, index: number) => (el: HTMLDivElement | null) => {
    if (el && observerRef.current) {
      el.id = `skill-${id}-${index}`;
      el.style.transitionDelay = `${index * 0.06}s`;
      observerRef.current.observe(el);
    }
  };

  return (
    <section id="skills" aria-labelledby="skills-heading">
      <div className="section-header">
        <p className="section-label">SKILL MATRIX</p>
        <h2 id="skills-heading" className="section-title">CAPABILITIES</h2>
        <div className="section-line" aria-hidden="true" />
      </div>

      {skillCategories.map((category, catIndex) => (
        <div key={category.label} className="skills-category">
          <p className="category-label">{category.label}</p>
          <div className="skills-grid" role="list">
            {category.skills.map((skill, index) => (
              <div
                key={`${category.label}-${skill.name}`}
                className={`skill-card ${visibleCards.has(`skill-${category.label}-${index}`) ? 'visible' : ''}`}
                role="listitem"
                ref={registerCard(category.label, index)}
              >
                <div className="skill-icon" aria-hidden="true">{skill.icon}</div>
                <div className="skill-name">{skill.name}</div>
                <div className="skill-tag">{skill.tag}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}