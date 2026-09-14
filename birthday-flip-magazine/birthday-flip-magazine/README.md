# 🎂 The Birthday Magazine — Real Page-Flip React App

Tumhare liye ek pura real "Vogue"-style birthday magazine bana hai — React + `react-pageflip`
se, jisme real page palatne wala 3D flip animation hai (click ya drag karke pages palto).
Isme tumhari 107 photos already daal di gayi hain, thematic sections mein organize karke.

## 📁 Kya kya hai isme

- **Cover page** — Vogue-style masthead, tumhari best photo ke saath
- **Intro / Dedication page**
- **Table of Contents**
- **Story pages** — "Who That Girl Is?", "The Moment We Began", "Our First Trip", "Our First Conversation"
- **Love Journey Timeline** (2023–2026, polaroid-style)
- **24 Memory Gallery pages** — baaki saari photos, theme-wise titles ke saath (Beach Day, College Fest, Traditional Vibes, wagera)
- **A Love Letter page** — tumhara personal birthday message
- **Back Cover**

Total ~41 pages, sab real photos ke saath.

---

## 🚀 Kaise chalayein (local computer par)

Tumhe **Node.js** install hona chahiye (v18 ya usse upar). Phir:

```bash
cd birthday-flip-magazine
npm install
npm run dev
```

Terminal mein ek link milega (usually `http://localhost:5173`) — usse browser mein kholo.

Jab final version chahiye ho (deploy karne ke liye), yeh run karo:

```bash
npm run build
```

Isse `dist` folder banega jisme static HTML/CSS/JS hoga — usse kahin bhi host kar sakte ho
(Netlify, Vercel, GitHub Pages, ya apne "birthday surprise system" ke andar iframe se bhi
embed kar sakte ho).

---

## ✏️ Customize kaise karein

Sab kuch **ek hi file** mein edit karna hai:

```
src/data/config.js
```

Isme yeh sab change kar sakte ho:
- `herName`, `girlName`, `boyName`
- Cover ka headline, tagline, year
- "Who That Girl", "How We Met", "First Trip", "First Conversation" wale paragraphs
- Timeline ke saal aur captions
- Love letter ka poora message

Bas text change karo, save karo, page apne aap update ho jayega (agar `npm run dev` chal raha hai).

### Photos change / rearrange karne ke liye

Saari photos `public/images/` folder mein hain (`img001.jpg` se `img107.jpg` tak).

- Kaunsi photo kahan use ho rahi hai, yeh control hota hai:
  `src/data/photos_data.json` (featured photos) — cover, timeline, story pages
- Baaki saari photos automatically "Memory Galleries" mein 4-4 ke group mein chali jaati hain,
  ek theme title ke saath (jaise "Beach Day Chronicles", "Silly Face Diaries").
- Agar koi specific photo kisi particular page par chahiye, toh `photos_data.json` mein uska
  filename daal do us section ke andar.
- Naya photo add karna ho: bas `public/images/` mein daal do aur `photos_data.json` mein uska
  naam kahin add kar do (ya naya gallery group bana lo).

### Design/colors change karne ke liye

Sab styling ek hi file mein hai: `src/styles/magazine.css`. Top mein hi color variables hain:

```css
--pink: #f6d9e3;
--cream: #fff8f2;
--black: #17140f;
--gold: #cda45e;
--rose-text: #a44a63;
```

Inhe change karke pura color theme badal sakte ho.

---

## 📱 Apne "birthday surprise system" mein add karna

Do options hain:

1. **Component ke roop mein**: agar tumhara surprise system bhi React mein hai, toh
   `src/App.jsx` aur uske saare imports (pages, data, styles) copy karke apne project mein
   ek component ki tarah use kar sakte ho.

2. **iframe / standalone page ke roop mein** (sabse aasan): `npm run build` karo, `dist`
   folder ko apne site ke kisi folder mein daal do (e.g. `/magazine/`), aur apne surprise
   system se `<iframe src="/magazine/index.html">` se link kar do, ya seedha ek button se
   naye tab mein khol do.

---

## 🛠️ Tech Stack

- React 18 + Vite
- [`react-pageflip`](https://www.npmjs.com/package/react-pageflip) — real 3D page-turn animation (click, drag, ya swipe se)
- Google Fonts: Playfair Display, Great Vibes, Poppins

Enjoy, aur Happy Birthday bolna mat bhulna! 🎉💕
