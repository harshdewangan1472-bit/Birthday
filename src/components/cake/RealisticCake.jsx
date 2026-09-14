import React from 'react';
import { motion } from 'framer-motion';
import {
  CandleGraphic,
  PinkRoseGraphic,
  WhiteRoseGraphic,
  GoldHeartGraphic,
  PearlsGraphic,
  ButterflyGraphic,
  RibbonGraphic,
  CakeTopperGraphic,
  SmallStarGraphic,
} from './DecorationSVGs';
import { TARGET_SLOTS } from './cakeConfig';

export function renderDecorationByType(type, sizeOverride) {
  switch (type) {
    case 'candle':
      return <CandleGraphic size={sizeOverride || 36} isLit={true} />;
    case 'cake_topper':
      return <CakeTopperGraphic size={sizeOverride || 52} />;
    case 'pink_rose':
      return <PinkRoseGraphic size={sizeOverride || 34} />;
    case 'white_rose':
      return <WhiteRoseGraphic size={sizeOverride || 34} />;
    case 'gold_heart':
      return <GoldHeartGraphic size={sizeOverride || 28} />;
    case 'pearls':
      return <PearlsGraphic size={sizeOverride || 44} />;
    case 'butterfly':
      return <ButterflyGraphic size={sizeOverride || 32} />;
    case 'ribbon':
      return <RibbonGraphic size={sizeOverride || 46} />;
    case 'small_star':
      return <SmallStarGraphic size={sizeOverride || 22} />;
    default:
      return null;
  }
}

export default function RealisticCake({
  isReference = false,
  placedItems = {}, // { slotId: itemType }
  onSlotClick,
  onItemRemove,
  highlightedSlotId = null,
  misplacedSlotId = null,
  selectedType = null,
  isComplete = false,
}) {
  return (
    <div className="relative w-full max-w-[260px] aspect-[360/260] mx-auto flex items-center justify-center select-none">
      {/* ── Soft Ambient Glow Behind Cake ── */}
      <motion.div
        animate={{
          scale: isComplete ? [1, 1.15, 1.05] : [0.96, 1.04, 0.96],
          opacity: isComplete ? [0.75, 0.95, 0.75] : [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-6 top-8 bottom-4 rounded-full blur-xl pointer-events-none"
        style={{
          background: isComplete
            ? 'radial-gradient(circle, rgba(255,215,0,0.55) 0%, rgba(255,105,180,0.3) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255,182,193,0.45) 0%, rgba(255,215,0,0.2) 65%, transparent 85%)',
        }}
      />

      {/* ── REALISTIC 2-TIER CAKE SVG (Compact ViewBox 0 0 360 260) ── */}
      <svg
        viewBox="0 0 360 260"
        className="w-full h-full filter drop-shadow-xl overflow-visible"
        fill="none"
      >
        <defs>
          {/* Pedestal Metallic Gold Gradients */}
          <linearGradient id="pedestalGold2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C69214" />
            <stop offset="25%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#FFD54F" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A5208" />
          </linearGradient>

          {/* Velvet Blush Pink Cake Tier Gradient (Cylindrical Lighting) */}
          <linearGradient id="cakePinkTier2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DE7E92" />
            <stop offset="20%" stopColor="#F8A5B8" />
            <stop offset="50%" stopColor="#FFE4EC" />
            <stop offset="78%" stopColor="#F39FB4" />
            <stop offset="100%" stopColor="#BA5B72" />
          </linearGradient>

          {/* Cake Top Ellipse Cream Gradient */}
          <radialGradient id="cakeTopPink2" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FFF9FB" />
            <stop offset="55%" stopColor="#FFD9E4" />
            <stop offset="90%" stopColor="#F4ABC0" />
            <stop offset="100%" stopColor="#DE7E92" />
          </radialGradient>

          {/* Royal Ivory Cream Drip Gradient */}
          <linearGradient id="creamDrip2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F5E8DC" />
          </linearGradient>

          {/* Gold Leaf Accent Gradient */}
          <linearGradient id="goldLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="50%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#9E700E" />
          </linearGradient>
        </defs>

        {/* ── 1. Scalloped Gold Platter Stand (y = 230 to 248) ── */}
        <g id="pedestal">
          {/* Cast Shadow */}
          <ellipse cx="180" cy="246" rx="142" ry="12" fill="rgba(80, 20, 35, 0.22)" filter="blur(5px)" />
          {/* Pedestal Top Edge */}
          <ellipse cx="180" cy="238" rx="138" ry="14" fill="url(#pedestalGold2)" stroke="#FFF2B2" strokeWidth="1" />
          <path d="M 42 238 C 42 245, 318 245, 318 238 L 310 245 C 310 250, 50 250, 50 245 Z" fill="#7A5208" />
          {/* Scalloped Gold Beads */}
          {[...Array(19)].map((_, i) => {
            const angle = (Math.PI / 18) * i;
            const cx = 180 - Math.cos(angle) * 133;
            const cy = 238 + Math.sin(angle) * 10;
            return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#FFFDE7" />;
          })}
        </g>

        {/* ── 2. Bottom Tier (Width 230px, Height 80px) ── */}
        <g id="bottomTier">
          {/* Cylinder Body */}
          <path
            d="M 65 155
               L 65 224
               A 115 22 0 0 0 295 224
               L 295 155
               A 115 22 0 0 1 65 155 Z"
            fill="url(#cakePinkTier2)"
          />

          {/* Bottom Tier Top Surface */}
          <ellipse cx="180" cy="155" rx="115" ry="22" fill="url(#cakeTopPink2)" stroke="#FFE8EF" strokeWidth="1" />

          {/* Royal Cream Piping Along Bottom Tier Top Rim */}
          <path
            d="M 65 155
               Q 85 168, 105 156
               Q 125 172, 145 158
               Q 165 170, 185 159
               Q 205 171, 225 158
               Q 245 172, 265 157
               Q 280 166, 295 155
               A 115 22 0 0 1 65 155 Z"
            fill="url(#creamDrip2)"
            opacity="0.96"
          />

          {/* Gold Leaf Flecks on Bottom Tier */}
          <polygon points="95,188 98,185 100,189 97,192" fill="url(#goldLeaf2)" />
          <polygon points="125,204 129,201 131,206 126,208" fill="url(#goldLeaf2)" />
          <polygon points="245,192 249,189 251,194 246,196" fill="url(#goldLeaf2)" />
          <polygon points="270,206 274,203 276,208 271,210" fill="url(#goldLeaf2)" />
        </g>

        {/* ── 3. Top Tier (Width 150px, Height 64px) ── */}
        <g id="topTier">
          {/* Cast Shadow on Bottom Tier */}
          <ellipse cx="180" cy="155" rx="78" ry="16" fill="rgba(80, 20, 35, 0.22)" filter="blur(3px)" />

          {/* Cylinder Body */}
          <path
            d="M 105 78
               L 105 138
               A 75 16 0 0 0 255 138
               L 255 78
               A 75 16 0 0 1 105 78 Z"
            fill="url(#cakePinkTier2)"
          />

          {/* Top Tier Top Surface */}
          <ellipse cx="180" cy="78" rx="75" ry="16" fill="url(#cakeTopPink2)" stroke="#FFE8EF" strokeWidth="1" />

          {/* Royal Cream Rosettes Along Top Tier Top Rim */}
          <path
            d="M 105 78
               Q 118 89, 130 80
               Q 142 91, 155 81
               Q 168 92, 180 82
               Q 192 92, 205 81
               Q 218 91, 230 80
               Q 242 89, 255 78
               A 75 16 0 0 1 105 78 Z"
            fill="url(#creamDrip2)"
            opacity="0.96"
          />

          {/* Gold Leaf Flecks on Top Tier */}
          <polygon points="135,106 138,103 140,107 136,109" fill="url(#goldLeaf2)" />
          <polygon points="225,110 229,107 231,112 226,114" fill="url(#goldLeaf2)" />
        </g>
      </svg>

      {/* ── 4. DECORATION OVERLAY LAYER (Exact Absolute Positions) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {TARGET_SLOTS.map((slot) => {
          const itemType = isReference ? slot.type : placedItems[slot.id];
          const hasItem = Boolean(itemType);
          const isHighlighted = highlightedSlotId === slot.id;
          const isMisplaced = misplacedSlotId === slot.id;
          // When user tapped a decoration in palette, illuminate all matching empty slots!
          const isMatchingTarget = selectedType && selectedType === slot.type && !hasItem;

          return (
            <div
              key={slot.id}
              style={{
                position: 'absolute',
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="pointer-events-auto flex items-center justify-center"
            >
              {/* Target Guide Ring (Visible in interactive mode when empty) */}
              {!isReference && !hasItem && (
                <motion.button
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSlotClick && onSlotClick(slot)}
                  animate={{
                    scale: (isMatchingTarget || isHighlighted) ? [1, 1.3, 1] : 1,
                    opacity: (isMatchingTarget || isHighlighted) ? 1 : 0.45,
                  }}
                  transition={{
                    duration: 1,
                    repeat: (isMatchingTarget || isHighlighted) ? Infinity : 0,
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isHighlighted
                      ? 'border-2 border-amber-400 bg-amber-400/40 shadow-[0_0_12px_rgba(255,215,0,0.9)]'
                      : isMatchingTarget
                      ? 'border-2 border-pink-500 bg-pink-400/40 shadow-[0_0_12px_rgba(236,72,153,0.85)] ring-2 ring-pink-300'
                      : 'border border-dashed border-white/80 bg-white/30 hover:border-pink-400 hover:bg-white/60'
                  }`}
                  title={`${slot.label} — Tap to place`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isMatchingTarget ? 'bg-pink-600' : 'bg-white'
                    }`}
                  />
                </motion.button>
              )}

              {/* Placed or Reference Decoration Item */}
              {hasItem && (
                <motion.div
                  initial={isReference ? false : { scale: 0.3, y: -10, opacity: 0 }}
                  animate={{
                    scale: isMisplaced ? [1, 1.15, 1] : 1,
                    y: 0,
                    opacity: 1,
                    filter: isMisplaced
                      ? 'drop-shadow(0 0 10px rgba(255, 50, 50, 0.95))'
                      : isReference || isComplete
                      ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
                      : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 22,
                  }}
                  onClick={() => !isReference && onItemRemove && onItemRemove(slot.id)}
                  className={`relative flex items-center justify-center group ${
                    !isReference ? 'cursor-pointer' : ''
                  }`}
                  title={!isReference ? `${slot.label} (Tap to remove)` : slot.label}
                >
                  {renderDecorationByType(itemType)}

                  {/* Remove indicator badge on interactive items */}
                  {!isReference && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500/90 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
                      ×
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
