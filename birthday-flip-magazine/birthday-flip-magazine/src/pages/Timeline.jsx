import React from "react";
import config from "../data/config";
import { featured } from "../data/photos";

export default function Timeline() {
  return (
    <div className="timeline-page">
      <div className="timeline-title">The Love Journey</div>
      <div className="timeline-sub">Year by year, memory by memory</div>
      <div className="timeline-grid">
        {config.timeline.map((t, i) => (
          <div className="timeline-item" key={t.year}>
            <img src={featured.timeline[i % featured.timeline.length]} alt={t.year} />
            <div className="timeline-year">{t.year}</div>
            <div className="timeline-caption">{t.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
