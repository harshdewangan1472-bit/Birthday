import React from "react";

const items = [
  ["01", "Who That Girl Is?"],
  ["02", "The Moment We Began"],
  ["03", "Our First Trip"],
  ["04", "Our First Conversation"],
  ["05", "The Love Journey — Timeline"],
  ["06", "Memory Galleries"],
  ["07", "A Letter For You"],
];

export default function TOC() {
  return (
    <div className="magazine-page toc-page">
      <div className="toc-title">Inside This Issue</div>
      <ul className="toc-list">
        {items.map(([num, title]) => (
          <li key={num}>
            <span>
              <span className="num">{num}</span>
              {title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
