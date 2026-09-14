import React from "react";
import config from "../data/config";
import { featured } from "../data/photos";

export function WhoThatGirlPage() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Cover Story</div>
      <h2 className="story-title">
        Who That <em>Girl</em> Is?
      </h2>
      <img className="story-photo" src={featured.whoThatGirl[0]} style={{ height: 170 }} alt="" />
      <p className="story-text">{config.whoThatGirlIntro}</p>
      <div className="story-subhead">"She's the main character, always."</div>
    </div>
  );
}

export function WhoThatGirlPage2() {
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

export function MomentWeBeganPage() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">How It Started</div>
      <h2 className="story-title">
        The Moment <em>We Began</em>
      </h2>
      <img className="story-photo" src={featured.momentWeBegan[0]} style={{ height: 190 }} alt="" />
      <p className="story-text">{config.howWeMet}</p>
    </div>
  );
}

export function FirstTripPage() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Our First Trip</div>
      <h2 className="story-title">Where It All Felt New</h2>
      <div className="two-photo-row">
        <img src={featured.firstTrip[0]} alt="" />
        <img src={featured.firstTrip[1]} alt="" />
      </div>
      <p className="story-text">{config.firstTripText}</p>
    </div>
  );
}

export function FirstConversationPage() {
  return (
    <div className="story-page">
      <div className="story-eyebrow">Our First Conversation</div>
      <h2 className="story-title">
        Just Two <em>Strangers</em>
      </h2>
      <img className="story-photo" src={featured.firstConversation} style={{ height: 210 }} alt="" />
      <p className="story-text">{config.firstConversationText}</p>
    </div>
  );
}
