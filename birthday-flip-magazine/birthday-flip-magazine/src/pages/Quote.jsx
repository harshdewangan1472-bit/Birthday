import React from "react";

export default function Quote({ text }) {
  return (
    <div className="quote-page">
      <div>
        <div className="quote-mark">"</div>
        <blockquote>{text}</blockquote>
      </div>
    </div>
  );
}
