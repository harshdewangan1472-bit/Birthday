import React from "react";
import config from "../data/config";

export default function Intro() {
  return (
    <div className="intro-page">
      <div className="intro-script">A Little Note Before You Begin</div>
      <p className="intro-body">
        Yeh sirf ek magazine nahi hai — yeh {config.girlName} ki hasi, uski yaadein aur
        humari kahani ka ek chhota sa collection hai. Har page palato aur relive karo woh
        sab pal jo humne saath banaye hain. Happy Birthday, in advance. 🎂✨
      </p>
    </div>
  );
}
