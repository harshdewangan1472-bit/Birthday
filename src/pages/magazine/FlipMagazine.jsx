import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";

import MagPage from "../../components/magazine/MagPage";
import {
  MagCover,
  MagIntro,
  MagTOC,
  MagWhoThatGirl,
  MagWhoThatGirl2,
  MagMomentWeBegan,
  MagFirstTrip,
  MagFirstConversation,
  MagTimeline,
  MagGallery,
  MagQuote,
  MagLoveLetter,
  MagBackCover,
} from "./MagPages";

import { galleries } from "../../data/magPhotos";
import magConfig from "../../data/magConfig";
import "../../styles/magazine.css";

const midQuotes = [
  "Some people make ordinary moments unforgettable.",
  "Every photo here is a reason to smile again.",
  "This is what happiness looks like, one memory at a time.",
  "Every second spent with you is my favorite memory.",
  "You are the poetry I never knew how to write.",
  "In your smile, I see something more beautiful than stars.",
  "Forever grateful for every single moment with you.",
];

export default function FlipMagazine({ onFinish }) {
  const bookRef = useRef(null);
  const [pageInfo, setPageInfo] = useState({ current: 0, total: 30 });
  const [isFlipping, setIsFlipping] = useState(false);

  // Build the full ordered list of pages
  const pages = useMemo(() => {
    const list = [];

    list.push(
      <MagPage key="cover" className="no-shadow">
        <MagCover />
      </MagPage>
    );
    list.push(
      <MagPage key="intro">
        <MagIntro />
      </MagPage>
    );
    list.push(
      <MagPage key="toc">
        <MagTOC />
      </MagPage>
    );

    list.push(
      <MagPage key="who1">
        <MagWhoThatGirl />
      </MagPage>
    );
    list.push(
      <MagPage key="who2">
        <MagWhoThatGirl2 />
      </MagPage>
    );
    list.push(
      <MagPage key="began">
        <MagMomentWeBegan />
      </MagPage>
    );
    list.push(
      <MagPage key="trip">
        <MagFirstTrip />
      </MagPage>
    );
    list.push(
      <MagPage key="conv">
        <MagFirstConversation />
      </MagPage>
    );
    list.push(
      <MagPage key="timeline">
        <MagTimeline />
      </MagPage>
    );

    galleries.forEach((g, i) => {
      list.push(
        <MagPage key={`gallery-${i}`}>
          <MagGallery title={g.title} images={g.images} />
        </MagPage>
      );
      if (i % 3 === 2 && midQuotes[Math.floor(i / 3) % midQuotes.length]) {
        list.push(
          <MagPage key={`quote-${i}`}>
            <MagQuote text={midQuotes[Math.floor(i / 3) % midQuotes.length]} />
          </MagPage>
        );
      }
    });

    list.push(
      <MagPage key="letter">
        <MagLoveLetter />
      </MagPage>
    );
    list.push(
      <MagPage key="back" className="no-shadow">
        <MagBackCover />
      </MagPage>
    );

    return list;
  }, []);

  const totalPages = pages.length;

  const goPrev = useCallback(() => {
    if (bookRef.current) {
      try {
        bookRef.current.pageFlip()?.flipPrev();
      } catch (err) {
        console.error("Flip prev error:", err);
      }
    }
  }, []);

  const goNext = useCallback(() => {
    if (bookRef.current) {
      try {
        bookRef.current.pageFlip()?.flipNext();
      } catch (err) {
        console.error("Flip next error:", err);
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  const isLastPage = pageInfo.current >= totalPages - 1;

  return (
    <div className="mag-shell">
      {/* Magazine Title Header */}
      <div className="mag-title-bar">
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 3, fontFamily: "'Playfair Display', serif" }}>
          {magConfig.magazineTitle}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 3, opacity: 0.7, textTransform: "uppercase" }}>
          The Birthday Magazine &bull; {magConfig.herName}
        </div>
      </div>

      {/* Book Container with 3D Flip */}
      <div className="mag-book-wrap">
        <HTMLFlipBook
          width={320}
          height={460}
          size="fixed"
          minWidth={280}
          maxWidth={400}
          minHeight={400}
          maxHeight={560}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          flippingTime={800}
          useMouseEvents={true}
          ref={bookRef}
          onFlip={(e) => {
            setPageInfo((p) => ({ ...p, current: e.data }));
            setIsFlipping(false);
          }}
          onChangeState={(e) => {
            if (e.data === "flipping") setIsFlipping(true);
          }}
          onInit={(e) => {
            const total = e?.data?.getPageCount ? e.data.getPageCount() : totalPages;
            setPageInfo({ current: 0, total });
          }}
          className="mag-flipbook"
        >
          {pages}
        </HTMLFlipBook>
      </div>

      {/* Controls Bar */}
      <div className="mag-controls">
        <button
          onClick={goPrev}
          disabled={pageInfo.current <= 0 || isFlipping}
          aria-label="Previous Page"
        >
          &larr; Prev
        </button>

        <span className="mag-page-indicator">
          Page {pageInfo.current + 1} / {totalPages}
        </span>

        <button
          onClick={goNext}
          disabled={isLastPage || isFlipping}
          aria-label="Next Page"
        >
          Next &rarr;
        </button>
      </div>

      {/* Continue to Letter / Surprise Button */}
      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        {onFinish && (
          <button
            className="mag-finish-btn"
            onClick={onFinish}
            style={{
              padding: "10px 24px",
              fontSize: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span>{isLastPage ? "Open Your Birthday Letter" : "Skip to Birthday Letter"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
