import React from "react";
import config from "../data/config";
import { featured } from "../data/photos";

export default function Cover() {
  return (
    <div className="cover-page">
      <img className="cover-photo" src={featured.cover} alt="cover" />
      <div className="cover-shade" />
      <div className="cover-content">
        <div className="cover-top-row">
          <span>{config.edition}</span>
          <span>{config.issueNumber}</span>
        </div>
        <div className="cover-masthead">{config.magazineTitle}</div>
        <div className="cover-edition">{config.herName}</div>

        <div className="cover-spacer" />

        <div className="cover-glow">
          <div className="cover-year">{config.coverYear}</div>
          <div className="cover-headline">{config.coverHeadline}</div>
          <div className="cover-tagline">{config.coverTagline}</div>
        </div>

        <div className="cover-bottom">
          <div>
            <div className="cover-magazine-word">the birthday</div>
            <div className="cover-magazine-word" style={{ marginTop: -6 }}>
              MAGAZINE
            </div>
          </div>
          <div className="barcode" />
        </div>
        <div className="cover-story">{config.coverStory}</div>
      </div>
    </div>
  );
}
