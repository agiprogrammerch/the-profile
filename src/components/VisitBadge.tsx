'use client';

export default function VisitBadge() {
  return (
    <div className="visit-badge" role="status" aria-live="polite">
      <div className="counter-ping" aria-hidden="true" />
      <span className="counter-label">PEAK RAM</span>
      <span className="counter-value" id="visit-count">
        {"< 1 GB"}
      </span>
    </div>
  );
}