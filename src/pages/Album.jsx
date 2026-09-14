import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import albumData from '../data/album.json';

const STICKER_COLORS = {
  heart: '#FF69B4',
  star: '#FFD700',
  flower: '#FF85A2',
  sparkle: '#A855F7',
};

export default function Album() {
  const [activePhoto, setActivePhoto] = useState(null);
  const navigate = useNavigate();
  const photos = albumData.photos;

  return (
    <div className="min-h-screen pt-16 pb-24"
      style={{ background: 'linear-gradient(135deg, #FFF8EF 0%, #FFF4F8 50%, #F3E5F5 100%)' }}>

      <div className="max-w-md mx-auto px-4">
        <motion.div className="text-center mt-6 mb-8"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-4 py-1 mb-3">
            <BookIcon size={14} color="#FF69B4" />
            <span className="text-xs font-bold text-pink-500 uppercase tracking-wide">Photo Album</span>
          </div>
          <h1 className="font-heading text-pink-500 text-3xl">Our Memories</h1>
          <p className="text-gray-400 text-sm mt-1">Swipe through our precious moments</p>
        </motion.div>

        {/* Swiper album */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards, Pagination]}
            pagination={{ clickable: true }}
            className="pb-10"
            style={{ '--swiper-pagination-color': '#FF69B4', '--swiper-pagination-bullet-inactive-color': '#FFB6C1' }}>

            {photos.map((photo, idx) => (
              <SwiperSlide key={photo.id}>
                <ScrapbookPage
                  photo={photo}
                  index={idx}
                  onClick={() => setActivePhoto(photo)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Back button */}
        <motion.button
          onClick={() => navigate('/journey')}
          className="btn-secondary w-full flex items-center justify-center gap-2 mt-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <ChevronLeftIcon size={18} /> Back to Journey
        </motion.button>
      </div>

      {/* Photo memory modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setActivePhoto(null)} />
            <motion.div
              className="relative z-10 w-full max-w-md glass-strong rounded-t-4xl p-6 pb-10"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

              <div className="w-10 h-1 bg-pink-200 rounded-full mx-auto mb-5" />

              {/* Photo */}
              <div className="polaroid mx-auto mb-4 rounded-lg overflow-hidden"
                style={{ transform: `rotate(${activePhoto.rotation}deg)`, maxWidth: '260px' }}>
                <img
                  src={activePhoto.src}
                  alt={activePhoto.caption}
                  className="w-full aspect-square object-cover bg-pink-50"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full aspect-square bg-gradient-to-br from-pink-100 to-pink-200 items-center justify-center hidden">
                  <HeartIcon size={48} color="#FF85A2" />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2 font-body">{activePhoto.caption}</p>
              </div>

              <div className="text-center mb-4">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wide">{activePhoto.date}</span>
              </div>

              <div className="glass rounded-3xl p-4 mb-4">
                <p className="font-display text-gray-700 text-base leading-relaxed text-center">
                  "{activePhoto.memory}"
                </p>
              </div>

              <button onClick={() => setActivePhoto(null)} className="btn-primary w-full">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrapbookPage({ photo, index, onClick }) {
  const STICKER_POSITIONS = [
    { top: '6%', left: '6%' },
    { top: '8%', right: '8%' },
    { bottom: '22%', left: '4%' },
    { bottom: '24%', right: '5%' },
  ];
  const stickerPos = STICKER_POSITIONS[index % STICKER_POSITIONS.length];
  const color = STICKER_COLORS[photo.sticker] || '#FF85A2';

  return (
    <div className="scrapbook-page rounded-3xl p-5 relative overflow-hidden cursor-pointer"
      style={{ minHeight: '460px', background: 'linear-gradient(145deg, #fffef9 0%, #fff8f0 100%)' }}
      onClick={onClick}>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-bl-3xl opacity-60" />

      {/* Sticker decoration */}
      <motion.div className="absolute z-10 opacity-80" style={stickerPos}
        animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <StickerSVG type={photo.sticker} color={color} size={28} />
      </motion.div>

      {/* Photo */}
      <motion.div
        className="polaroid rounded-lg overflow-hidden mx-auto mb-4"
        style={{ transform: `rotate(${photo.rotation}deg)`, maxWidth: '260px' }}
        whileHover={{ scale: 1.02, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}>
        <img
          src={photo.src}
          alt={photo.caption}
          className="w-full aspect-square object-cover bg-gradient-to-br from-pink-100 to-pink-200"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full aspect-square bg-gradient-to-br from-pink-100 to-pink-200 items-center justify-center hidden rounded-t-sm">
          <HeartIcon size={56} color="#FF85A2" />
        </div>
        <p className="text-center text-xs text-gray-500 mt-1 pb-1 font-body italic">{photo.caption}</p>
      </motion.div>

      {/* Date tag */}
      <div className="flex justify-center mb-3">
        <span className="bg-pink-100 text-pink-500 text-xs font-bold rounded-full px-4 py-1 font-body">
          {photo.date}
        </span>
      </div>

      {/* Memory excerpt */}
      <p className="text-gray-500 text-xs text-center leading-relaxed font-body italic px-2">
        "{photo.memory.slice(0, 80)}..."
      </p>
      <p className="text-center text-pink-400 text-xs mt-2 font-medium">Tap to read full memory</p>

      {/* Decorative doodle lines */}
      <svg className="absolute bottom-4 left-4 opacity-20" width="40" height="20">
        <path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke="#FF85A2" strokeWidth="1.5" fill="none"/>
      </svg>
      <svg className="absolute bottom-4 right-4 opacity-20" width="30" height="30">
        <circle cx="15" cy="15" r="12" stroke="#FFB6C1" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
      </svg>
    </div>
  );
}

function StickerSVG({ type, color, size }) {
  if (type === 'heart') return <HeartIcon size={size} color={color} />;
  if (type === 'star') return <StarIcon size={size} color={color} />;
  if (type === 'flower') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"/>
      <path d="M12 22a2 2 0 0 1-2-2v-3a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2z"/>
      <path d="M2 12a2 2 0 0 1 2-2h3a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2z"/>
      <path d="M22 12a2 2 0 0 1-2 2h-3a2 2 0 0 1 0-4h3a2 2 0 0 1 2 2z"/>
    </svg>
  );
  return <StarIcon size={size} color={color} />;
}

function HeartIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
}
function StarIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-.91z"/></svg>;
}
function BookIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function ChevronLeftIcon({ size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
