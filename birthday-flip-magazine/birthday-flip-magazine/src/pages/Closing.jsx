import React from "react";
import config from "../data/config";
import { featured } from "../data/photos";

export function LoveLetterPage() {
  return (
    <div className="letter-page">
      <div className="letter-title">{config.loveLetterTitle}</div>
      <p className="letter-body">{config.loveLetter}</p>
      <div className="letter-signature">— {config.boyName}</div>
    </div>
  );
}

export function BackCover() {
  return (
    <div className="back-cover">
      <img src={featured.backCover} alt="" />
      <div className="back-cover-content">
        <div className="back-cover-quote">{config.backCoverQuote}</div>
        <div className="back-cover-brand">The Birthday Magazine</div>
      </div>
    </div>
  );
}
