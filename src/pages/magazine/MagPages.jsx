import magConfig from "../../data/magConfig";
import { featured } from "../../data/magPhotos";

export function MagCover() {
  return (
    <div className="cover-page">
      <img className="cover-photo" src={featured.cover} alt="cover" />
      <div className="cover-shade" />
      <div className="cover-content">
        <div className="cover-top-row">
          <span>{magConfig.edition}</span>
          <span>{magConfig.issueNumber}</span>
        </div>
        <div className="cover-masthead">{magConfig.magazineTitle}</div>
        <div className="cover-edition">{magConfig.herName}</div>

        <div className="cover-spacer" />

        <div className="cover-glow">
          <div className="cover-year">{magConfig.coverYear}</div>
          <div className="cover-headline">{magConfig.coverHeadline}</div>
          <div className="cover-tagline">{magConfig.coverTagline}</div>
        </div>

        <div className="cover-bottom">
          <div>
            <div className="cover-magazine-word">the birthday</div>
            <div className="cover-magazine-word" style={{ marginTop: -6 }}>MAGAZINE</div>
          </div>
          <div className="barcode" />
        </div>
        <div className="cover-story">{magConfig.coverStory}</div>
      </div>
    </div>
  );
}

export function MagIntro() {
  return (
    <div className="intro-page">
      <div className="intro-script">To the birthday girl</div>
      <p className="intro-body">
        Yeh magazine sirf photos ka collection nahi hai — yeh hai unki muskuraahaton ka
        jashn, unke har pal ki yaad, aur humari dosti ki kahani jo hamesha dil mein
        rahegi. Happy 21st Birthday, Meri Jaan.
      </p>
    </div>
  );
}

export function MagTOC() {
  return (
    <div className="toc-page">
      <div className="toc-title">Inside This Issue</div>
      <ul className="toc-list">
        <li><span><span className="num">01</span> Who That Girl Is?</span><span>04</span></li>
        <li><span><span className="num">02</span> The Moment We Began</span><span>06</span></li>
        <li><span><span className="num">03</span> First Trip Together</span><span>08</span></li>
        <li><span><span className="num">04</span> First Conversation</span><span>10</span></li>
        <li><span><span className="num">05</span> Our Timeline</span><span>12</span></li>
        <li><span><span className="num">06</span> Gallery — Candid Moments</span><span>14</span></li>
        <li><span><span className="num">07</span> Gallery — Golden Hours</span><span>16</span></li>
        <li><span><span className="num">08</span> Gallery — Pure Joy</span><span>18</span></li>
        <li><span><span className="num">...</span> ...and many more</span><span></span></li>
        <li><span><span className="num">—</span> A Love Letter</span><span>last</span></li>
      </ul>
    </div>
  );
}

export function MagWhoThatGirl() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Cover Story</div>
      <h2 className="story-title">Who That <em>Girl</em> Is?</h2>
      <img className="story-photo" src={featured.whoThatGirl[0]} style={{ height: 170 }} alt="" />
      <p className="story-text">{magConfig.whoThatGirlIntro}</p>
      <div className="story-subhead">"She's the main character, always."</div>
    </div>
  );
}

export function MagWhoThatGirl2() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Continued</div>
      <h2 className="story-title">Behind The Smile</h2>
      <img className="story-photo" src={featured.whoThatGirl[1]} style={{ height: 220 }} alt="" />
      <p className="story-text">
        Chahe koi bhi mood ho, uski energy hamesha sabse alag hoti hai — thodi si masti,
        thoda pyaar, aur bahut saara sukoon.
      </p>
    </div>
  );
}

export function MagMomentWeBegan() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">How It Started</div>
      <h2 className="story-title">The Moment <em>We Began</em></h2>
      <img className="story-photo" src={featured.momentWeBegan[0]} style={{ height: 190 }} alt="" />
      <p className="story-text">{magConfig.howWeMet}</p>
    </div>
  );
}

export function MagFirstTrip() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Our First Trip</div>
      <h2 className="story-title">Where It All Felt New</h2>
      <div className="two-photo-row">
        <img src={featured.firstTrip[0]} alt="" />
        <img src={featured.firstTrip[1]} alt="" />
      </div>
      <p className="story-text">{magConfig.firstTripText}</p>
    </div>
  );
}

export function MagFirstConversation() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Our First Conversation</div>
      <h2 className="story-title">Just Two <em>Strangers</em></h2>
      <img className="story-photo" src={featured.firstConversation} style={{ height: 210 }} alt="" />
      <p className="story-text">{magConfig.firstConversationText}</p>
    </div>
  );
}

export function MagTimeline() {
  return (
    <div className="timeline-page">
      <div className="timeline-title">Our Journey</div>
      <div className="timeline-sub">A YEAR BY YEAR STORY</div>
      <div className="timeline-grid">
        {magConfig.timeline.map((item, i) => (
          <div key={i} className="timeline-item">
            <img src={featured.timeline[i]} alt="" />
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-caption">{item.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MagGallery({ title, images }) {
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

export function MagQuote({ text }) {
  return (
    <div className="quote-page">
      <div>
        <div className="quote-mark">"</div>
        <blockquote>{text}</blockquote>
      </div>
    </div>
  );
}

export function MagLoveLetter() {
  return (
    <div className="letter-page">
      <div className="letter-title">{magConfig.loveLetterTitle}</div>
      <p className="letter-body">{magConfig.loveLetter}</p>
      <div className="letter-signature">— {magConfig.boyName}</div>
    </div>
  );
}

export function MagBackCover() {
  return (
    <div className="back-cover">
      <img src={featured.backCover} alt="" />
      <div className="back-cover-content">
        <div className="back-cover-quote">{magConfig.backCoverQuote}</div>
        <div className="back-cover-brand">The Birthday Magazine</div>
      </div>
    </div>
  );
}
