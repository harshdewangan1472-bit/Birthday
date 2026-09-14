import React from "react";

export default function Gallery({ title, images }) {
  return (
    <div className="gallery-page">
      <div className="gallery-title">{title}</div>
      <div className="gallery-rule" />
      <div className="gallery-grid">
        {images.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>
    </div>
  );
}
