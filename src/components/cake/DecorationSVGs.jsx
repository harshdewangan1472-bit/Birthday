import React from 'react';
import { motion } from 'framer-motion';

/* ─── 1. LUXURY CANDLE (Slender ivory & rose gold spiral with realistic flickering flame) ─── */
export function CandleGraphic({ size = 48, isLit = true }) {
  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: size * 0.45, height: size * 1.4 }}>
      {/* Animated Realistic Flame */}
      {isLit && (
        <motion.div
          animate={{
            scale: [1, 1.08, 0.94, 1.05, 1],
            y: [0, -1, 1, -0.5, 0],
            opacity: [0.95, 1, 0.9, 1, 0.95],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 flex flex-col items-center pointer-events-none"
        >
          {/* Ambient Warm Glow */}
          <div
            className="absolute -top-3 w-10 h-10 rounded-full blur-md pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,200,80,0.6) 0%, rgba(255,140,0,0.2) 60%, transparent 80%)' }}
          />
          {/* Outer Orange Flame */}
          <div
            className="w-3.5 h-6 rounded-full relative"
            style={{
              background: 'linear-gradient(180deg, #FFF9C4 0%, #FFD54F 35%, #FF9800 70%, #E65100 100%)',
              borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
              boxShadow: '0 0 10px rgba(255, 180, 0, 0.9)',
            }}
          >
            {/* Inner White-Hot Core */}
            <div
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDE7 70%, #FFE082 100%)',
                borderRadius: '50% 50% 40% 40%',
              }}
            />
          </div>
          {/* Candle Wick */}
          <div className="w-0.5 h-1.5 bg-neutral-800 -mt-0.5 rounded-full" />
        </motion.div>
      )}

      {/* Candle Shaft */}
      <svg width={size * 0.35} height={size * 1.1} viewBox="0 0 14 55" fill="none">
        <defs>
          <linearGradient id="candleBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFF1F5" />
            <stop offset="70%" stopColor="#FCE4EC" />
            <stop offset="100%" stopColor="#E0B7C6" />
          </linearGradient>
          <linearGradient id="goldSpiralGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997300" />
          </linearGradient>
        </defs>
        {/* Main Candle Cylinder */}
        <rect x="1" y="2" width="12" height="50" rx="3" fill="url(#candleBaseGrad)" />
        {/* Gold Spiral Ribbons */}
        <path d="M1 10 Q 7 14, 13 11 L 13 14 Q 7 17, 1 13 Z" fill="url(#goldSpiralGrad)" opacity="0.9" />
        <path d="M1 22 Q 7 26, 13 23 L 13 26 Q 7 29, 1 25 Z" fill="url(#goldSpiralGrad)" opacity="0.9" />
        <path d="M1 34 Q 7 38, 13 35 L 13 38 Q 7 41, 1 37 Z" fill="url(#goldSpiralGrad)" opacity="0.9" />
        {/* Top Rim */}
        <ellipse cx="7" cy="3" rx="5.5" ry="2" fill="#FFFDE7" />
      </svg>
    </div>
  );
}

/* ─── 2. REALISTIC PINK ROSE (Multi-layered velvet petals with realistic shading) ─── */
export function PinkRoseGraphic({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" className="filter drop-shadow-md select-none">
      <defs>
        <radialGradient id="rosePinkGrad1" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFE4EC" />
          <stop offset="45%" stopColor="#F48FB1" />
          <stop offset="85%" stopColor="#D81B60" />
          <stop offset="100%" stopColor="#880E4F" />
        </radialGradient>
        <radialGradient id="rosePinkInner" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="50%" stopColor="#EC407A" />
          <stop offset="100%" stopColor="#AD1457" />
        </radialGradient>
        <linearGradient id="roseLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5D6A7" />
          <stop offset="50%" stopColor="#388E3C" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>

      {/* Emerald Rose Calyx Leaves */}
      <path d="M12 36 C8 42, 14 48, 22 44 C18 40, 15 37, 12 36 Z" fill="url(#roseLeafGrad)" />
      <path d="M38 36 C42 42, 36 48, 28 44 C32 40, 35 37, 38 36 Z" fill="url(#roseLeafGrad)" />

      {/* Outer Petals */}
      <path d="M25 4 C15 4, 6 15, 8 28 C10 38, 22 46, 25 46 C28 46, 40 38, 42 28 C44 15, 35 4, 25 4 Z" fill="url(#rosePinkGrad1)" />
      
      {/* Intermediate Petals */}
      <path d="M14 18 C18 10, 32 10, 36 18 C40 26, 34 38, 25 40 C16 38, 10 26, 14 18 Z" fill="url(#rosePinkInner)" opacity="0.95" />
      <path d="M18 16 C22 12, 30 13, 33 18 C35 24, 30 32, 25 34 C19 32, 15 24, 18 16 Z" fill="url(#rosePinkGrad1)" />

      {/* Heart of Rose / Tight Swirl */}
      <path d="M22 20 C24 16, 28 17, 29 21 C30 25, 27 28, 25 28 C23 28, 21 24, 22 20 Z" fill="#880E4F" />
      <path d="M23 21 C24 19, 27 19, 27 22 C27 24, 25 25, 24 25 C23 25, 22 23, 23 21 Z" fill="#FFF0F5" opacity="0.8" />
    </svg>
  );
}

/* ─── 3. REALISTIC WHITE / IVORY ROSE (Dusted with delicate gold shimmer) ─── */
export function WhiteRoseGraphic({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" className="filter drop-shadow-md select-none">
      <defs>
        <radialGradient id="roseWhiteGrad1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFFDE7" />
          <stop offset="85%" stopColor="#EFEBE9" />
          <stop offset="100%" stopColor="#D7CCC8" />
        </radialGradient>
        <radialGradient id="roseWhiteGoldShimmer" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFF8E1" />
          <stop offset="90%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#D4AF37" />
        </radialGradient>
      </defs>

      {/* Outer Ivory Petals */}
      <path d="M25 4 C15 4, 6 15, 8 28 C10 38, 22 46, 25 46 C28 46, 40 38, 42 28 C44 15, 35 4, 25 4 Z" fill="url(#roseWhiteGrad1)" />
      
      {/* Mid Petals */}
      <path d="M14 18 C18 10, 32 10, 36 18 C40 26, 34 38, 25 40 C16 38, 10 26, 14 18 Z" fill="url(#roseWhiteGoldShimmer)" opacity="0.9" />
      <path d="M18 16 C22 12, 30 13, 33 18 C35 24, 30 32, 25 34 C19 32, 15 24, 18 16 Z" fill="url(#roseWhiteGrad1)" />

      {/* Core Bud */}
      <path d="M22 20 C24 16, 28 17, 29 21 C30 25, 27 28, 25 28 C23 28, 21 24, 22 20 Z" fill="#BCAAA4" />
      <path d="M23 21 C24 19, 27 19, 27 22 C27 24, 25 25, 24 25 C23 25, 22 23, 23 21 Z" fill="#FFFFFF" />
      {/* Gold edge shimmer */}
      <circle cx="25" cy="24" r="1.5" fill="#FFD54F" opacity="0.9" />
    </svg>
  );
}

/* ─── 4. METALLIC 3D GOLD HEART (Polished mirror finish with specular glint) ─── */
export function GoldHeartGraphic({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="goldHeartBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8DC" />
          <stop offset="25%" stopColor="#FFE082" />
          <stop offset="55%" stopColor="#D4AF37" />
          <stop offset="85%" stopColor="#AA7A1E" />
          <stop offset="100%" stopColor="#66460B" />
        </linearGradient>
        <linearGradient id="goldSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 3D Heart Body */}
      <path
        d="M20 35 C11 26, 4 19, 4 11.5 C4 5.5, 9 2, 14.5 2 C17.8 2, 19.5 4, 20 5 C20.5 4, 22.2 2, 25.5 2 C31 2, 36 5.5, 36 11.5 C36 19, 29 26, 20 35 Z"
        fill="url(#goldHeartBody)"
      />
      {/* Mirror Specular Highlight */}
      <path
        d="M14.5 5 C10.5 5, 7.5 7.5, 7.5 11.5 C7.5 15, 11 20, 16 24 C14 20, 12 16, 12 12 C12 8, 14 6, 14.5 5 Z"
        fill="url(#goldSpecular)"
      />
    </svg>
  );
}

/* ─── 5. EDIBLE PEARL GARLAND / BEADS (Spherical iridescent white pearls) ─── */
export function PearlsGraphic({ size = 46 }) {
  return (
    <svg width={size * 1.8} height={size * 0.45} viewBox="0 0 90 22" fill="none" className="filter drop-shadow-sm select-none">
      <defs>
        <radialGradient id="pearlSphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FFF8F0" />
          <stop offset="80%" stopColor="#E2DCD5" />
          <stop offset="100%" stopColor="#B3AAA0" />
        </radialGradient>
      </defs>
      {/* String of 7 connected lustrous pearls */}
      {[10, 22, 34, 46, 58, 70, 80].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="11" r="5.5" fill="url(#pearlSphere)" />
          {/* Top specular glint */}
          <circle cx={cx - 1.8} cy="8.2" r="1.3" fill="#FFFFFF" opacity="0.95" />
        </g>
      ))}
    </svg>
  );
}

/* ─── 6. DELICATE GOLD VEINED BUTTERFLY (Romantic translucent wings) ─── */
export function ButterflyGraphic({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 40" fill="none" className="filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="butterflyWing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#FFD54F" />
          <stop offset="80%" stopColor="#FF80AB" />
          <stop offset="100%" stopColor="#C2185B" />
        </linearGradient>
      </defs>
      {/* Upper Wings */}
      <path d="M22 18 C17 6, 2 8, 4 20 C6 28, 18 24, 22 20 Z" fill="url(#butterflyWing)" opacity="0.9" />
      <path d="M22 18 C27 6, 42 8, 40 20 C38 28, 26 24, 22 20 Z" fill="url(#butterflyWing)" opacity="0.9" />
      {/* Lower Wings */}
      <path d="M22 20 C18 24, 8 28, 10 35 C12 39, 20 34, 22 24 Z" fill="url(#butterflyWing)" opacity="0.85" />
      <path d="M22 20 C26 24, 36 28, 34 35 C32 39, 24 34, 22 24 Z" fill="url(#butterflyWing)" opacity="0.85" />
      {/* Gold Veins */}
      <path d="M22 18 Q 12 14, 8 20 M22 18 Q 14 20, 12 26" stroke="#AA7A1E" strokeWidth="0.8" opacity="0.75" />
      <path d="M22 18 Q 32 14, 36 20 M22 18 Q 30 20, 32 26" stroke="#AA7A1E" strokeWidth="0.8" opacity="0.75" />
      {/* Slender Body & Antennae */}
      <ellipse cx="22" cy="20" rx="1.5" ry="7" fill="#D4AF37" />
      <path d="M21 13 Q 19 8, 16 7 M23 13 Q 25 8, 28 7" stroke="#D4AF37" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

/* ─── 7. LUXURY SATIN SILK RIBBON BOW (Volumetric folds and flowing tails) ─── */
export function RibbonGraphic({ size = 54 }) {
  return (
    <svg width={size * 1.3} height={size * 0.85} viewBox="0 0 70 48" fill="none" className="filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="ribbonSilk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="35%" stopColor="#F06292" />
          <stop offset="70%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#AD1457" />
        </linearGradient>
        <linearGradient id="ribbonHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Flowing Tails */}
      <path d="M30 26 C24 34, 18 42, 14 46 L24 44 L28 32 Z" fill="#880E4F" opacity="0.9" />
      <path d="M40 26 C46 34, 52 42, 56 46 L46 44 L42 32 Z" fill="#880E4F" opacity="0.9" />

      {/* Left Loop */}
      <path d="M35 22 C22 10, 6 12, 10 24 C14 34, 28 26, 35 23 Z" fill="url(#ribbonSilk)" />
      <path d="M30 18 C22 14, 12 16, 14 22 Z" fill="url(#ribbonHighlight)" />

      {/* Right Loop */}
      <path d="M35 22 C48 10, 64 12, 60 24 C56 34, 42 26, 35 23 Z" fill="url(#ribbonSilk)" />
      <path d="M40 18 C48 14, 58 16, 56 22 Z" fill="url(#ribbonHighlight)" />

      {/* Center Knot with Gold Accent Ring */}
      <ellipse cx="35" cy="22" rx="4.5" ry="5.5" fill="url(#ribbonSilk)" />
      <ellipse cx="35" cy="22" rx="5" ry="2" fill="#D4AF37" opacity="0.8" />
    </svg>
  );
}

/* ─── 8. POLISHED GOLD "21 & FABULOUS" CAKE TOPPER ─── */
export function CakeTopperGraphic({ size = 68 }) {
  return (
    <svg width={size * 1.4} height={size * 1.1} viewBox="0 0 96 76" fill="none" className="filter drop-shadow-lg select-none">
      <defs>
        <linearGradient id="topperGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="30%" stopColor="#FFD54F" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6510" />
        </linearGradient>
      </defs>

      {/* Slender Acrylic Insertion Stakes */}
      <line x1="38" y1="46" x2="38" y2="74" stroke="url(#topperGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="46" x2="58" y2="74" stroke="url(#topperGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Sculpted Crown Top */}
      <path d="M48 6 L52 14 L60 8 L57 20 L39 20 L36 8 L44 14 Z" fill="url(#topperGoldGrad)" />

      {/* Big Elegant "21" Typography */}
      <text
        x="48"
        y="38"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif, Georgia"
        fontSize="28"
        fontWeight="800"
        fill="url(#topperGoldGrad)"
        letterSpacing="2"
      >
        21
      </text>

      {/* Delicate Curved Underline Ring */}
      <path d="M22 44 Q 48 50, 74 44" stroke="url(#topperGoldGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Micro Hearts on ends */}
      <circle cx="21" cy="44" r="2" fill="#FFD54F" />
      <circle cx="75" cy="44" r="2" fill="#FFD54F" />
    </svg>
  );
}

/* ─── 9. SHIMMERING 8-POINT GOLD FOIL STAR ─── */
export function SmallStarGraphic({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="filter drop-shadow-sm select-none">
      <defs>
        <radialGradient id="starGlint" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FFF59D" />
          <stop offset="75%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6510" />
        </radialGradient>
      </defs>
      {/* 8-Point Diamond Star */}
      <path
        d="M16 2 L18.5 12 L28.5 7 L21 14.5 L30 16 L21 17.5 L28.5 25 L18.5 20 L16 30 L13.5 20 L3.5 25 L11 17.5 L2 16 L11 14.5 L3.5 7 L13.5 12 Z"
        fill="url(#starGlint)"
      />
      {/* Center Specular Glint */}
      <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
    </svg>
  );
}
