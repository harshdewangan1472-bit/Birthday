import React, { useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

import Page from "./components/Page";
import Cover from "./pages/Cover";
import Intro from "./pages/Intro";
import TOC from "./pages/TOC";
import {
  WhoThatGirlPage,
  WhoThatGirlPage2,
  MomentWeBeganPage,
  FirstTripPage,
  FirstConversationPage,
} from "./pages/StoryPages";
import Timeline from "./pages/Timeline";
import Gallery from "./pages/Gallery";
import Quote from "./pages/Quote";
import { LoveLetterPage, BackCover } from "./pages/Closing";

import { galleries } from "./data/photos";
import config from "./data/config";

import "./styles/magazine.css";

// A couple of hand-written quotes sprinkled between galleries.
const midQuotes = [
  "Some people make ordinary moments unforgettable.",
  "Every photo here is a reason to smile again.",
  "This is what happiness looks like, one memory at a time.",
];

export default function App() {
  const bookRef = useRef(null);
  const [pageInfo, setPageInfo] = useState({ current: 0, total: 1 });

  // Build the full ordered list of pages once.
  const pages = useMemo(() => {
    const list = [];

    list.push(<Page key="cover" className="no-shadow">{<Cover />}</Page>);
    list.push(<Page key="intro">{<Intro />}</Page>);
    list.push(<Page key="toc">{<TOC />}</Page>);

    list.push(<Page key="who1">{<WhoThatGirlPage />}</Page>);
    list.push(<Page key="who2">{<WhoThatGirlPage2 />}</Page>);
    list.push(<Page key="began">{<MomentWeBeganPage />}</Page>);
    list.push(<Page key="trip">{<FirstTripPage />}</Page>);
    list.push(<Page key="conv">{<FirstConversationPage />}</Page>);
    list.push(<Page key="timeline">{<Timeline />}</Page>);

    galleries.forEach((g, i) => {
      list.push(
        <Page key={`gallery-${i}`}>
          <Gallery title={g.title} images={g.images} />
        </Page>
      );
      if (midQuotes[i % midQuotes.length] && i % 4 === 3) {
        list.push(
          <Page key={`quote-${i}`}>
            <Quote text={midQuotes[i % midQuotes.length]} />
          </Page>
        );
      }
    });

    list.push(<Page key="letter">{<LoveLetterPage />}</Page>);
    list.push(<Page key="back" className="no-shadow">{<BackCover />}</Page>);

    return list;
  }, []);

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => bookRef.current?.pageFlip()?.flipNext();

  return (
    <div className="app-shell">
      <div className="magazine-title-bar">
        <div style={{ fontSize: 22, fontWeight: 700 }}>{config.magazineTitle}</div>
        <div style={{ fontSize: 10, letterSpacing: 2 }}>THE BIRTHDAY MAGAZINE</div>
      </div>

      <div className="book-wrap">
        <HTMLFlipBook
          width={320}
          height={460}
          size="fixed"
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          ref={bookRef}
          onFlip={(e) =>
            setPageInfo((p) => ({ ...p, current: e.data }))
          }
          onInit={(e) =>
            setPageInfo({ current: 0, total: e.data.getPageCount ? e.data.getPageCount() : pages.length })
          }
          className="flipbook"
        >
          {pages}
        </HTMLFlipBook>
      </div>

      <div className="controls">
        <button onClick={goPrev} disabled={pageInfo.current <= 0}>
          &larr; Prev
        </button>
        <span className="page-indicator">
          Page {pageInfo.current + 1} / {pages.length}
        </span>
        <button onClick={goNext} disabled={pageInfo.current >= pages.length - 1}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
