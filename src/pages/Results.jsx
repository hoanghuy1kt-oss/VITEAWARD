import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { VOTE_CATEGORIES } from '../data/categories';

// Hàm tạo danh sách đề cử ảo cho mỗi hạng mục con
const generateDummyLeaderboard = (subId, subTitle, isEn) => {
  const images = [
    'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop', // Halong Bay
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop', // Terraces
    'https://images.unsplash.com/photo-1599708153386-62bf3f044d03?q=80&w=600&auto=format&fit=crop', // Cityscape
    'https://images.unsplash.com/photo-1582035313360-1e5b877c4491?q=80&w=600&auto=format&fit=crop', // Resort
    'https://images.unsplash.com/photo-1596401057633-54a8fb6944b4?q=80&w=600&auto=format&fit=crop', // Beach
    'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=600&auto=format&fit=crop', // Mountains
    'https://images.unsplash.com/photo-1542314831-c6a4d14effb0?q=80&w=600&auto=format&fit=crop', // Waterfall
    'https://images.unsplash.com/photo-1506744626753-1fa28f6e5ebb?q=80&w=600&auto=format&fit=crop'  // Nature
  ];
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `${subId}-n${i + 1}`,
    name: `${isEn ? 'Outstanding Nominee No. ' : 'Đề cử xuất sắc số '}${(i + 1).toString().padStart(2, '0')}`,
    desc: subTitle,
    image: images[i % images.length],
    votes: 15000 - i * 1200 + Math.floor(Math.random() * 500) // Tạo số vote ảo có xu hướng giảm dần theo rank
  }));
};

export default function Results() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  // Tầng 1: Chọn Tab Nhóm Lớn
  const [currentCat, setCurrentCat] = useState('cat5');
  const activeCategory = VOTE_CATEGORIES.find(c => c.id === currentCat) || VOTE_CATEGORIES[0];

  // Tầng 2: Chọn Hạng mục con
  const [selectedSub, setSelectedSub] = useState(activeCategory.items[0]);

  // Tầng 3: Bảng xếp hạng của Hạng mục con đang chọn
  const [leaderboard, setLeaderboard] = useState([]);

  // Khi đổi Tab lớn -> tự động focus vào Hạng mục con đầu tiên của Tab đó
  useEffect(() => {
    const cat = VOTE_CATEGORIES.find(c => c.id === currentCat);
    if (cat && cat.items.length > 0) {
      setSelectedSub(cat.items[0]);
    }
  }, [currentCat]);

  // Khi Hạng mục con thay đổi -> Tạo Leaderboard mới
  useEffect(() => {
    if (selectedSub) {
      setLeaderboard(generateDummyLeaderboard(selectedSub.id, isEn ? selectedSub.titleEn || selectedSub.title : selectedSub.title, isEn));
    }
  }, [selectedSub, isEn]);

  // Hiệu ứng Live Update (nhảy phiếu)
  useEffect(() => {
    const timer = setInterval(() => {
      setLeaderboard(prev => {
        if (!prev || prev.length === 0) return prev;
        const next = [...prev];
        // Chọn ngẫu nhiên 1-3 đề cử để tăng phiếu
        const numToUpdate = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numToUpdate; i++) {
          const pickIdx = Math.floor(Math.random() * next.length);
          next[pickIdx] = { ...next[pickIdx], votes: next[pickIdx].votes + Math.floor(Math.random() * 25) + 5 };
        }
        // Sắp xếp lại sau khi tăng phiếu
        return next.sort((a,b) => b.votes - a.votes);
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [selectedSub]);

  const top = [...leaderboard].sort((a,b) => b.votes - a.votes);
  const max = top[0]?.votes || 1;
  return (
    <PageTransition>
      <section id="winners" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="apg-hero-script" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('results.tag')}</span>
              <h2 className="apg-sec-heading">{t('results.title')} <span className="gold-text">{t('results.highlight')}</span></h2>
              <div className="apg-gold-rule" style={{ margin: '20px auto 28px' }}></div>
              <p className="apg-body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('results.desc')}</p>
            </div>

            {/* TẦNG 1: TAB NHÓM LỚN */}
            <div className="vote-toolbar" style={{ overflowX: 'auto', paddingBottom: '10px', margin: '0 auto 30px auto', maxWidth: 'max-content' }}>
              <div className="vote-tabs" style={{ display: 'flex', gap: '10px', minWidth: 'max-content', padding: '0 10px' }}>
                {VOTE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={currentCat === cat.id ? 'active' : ''}
                    onClick={() => setCurrentCat(cat.id)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isEn && cat.labelEn ? cat.labelEn : cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TẦNG 2: MENU HẠNG MỤC CON */}
            <div style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <h4 style={{ color: 'var(--text-soft)', fontSize: '0.95rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {isEn ? 'Select Category:' : 'Chọn Hạng Mục Tranh Giải:'}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {activeCategory.items.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${selectedSub?.id === sub.id ? 'var(--gold-200)' : 'var(--line)'}`,
                      background: selectedSub?.id === sub.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                      color: selectedSub?.id === sub.id ? 'var(--gold-200)' : '#fff',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      fontFamily: 'Be Vietnam Pro'
                    }}
                  >
                    {sub.id}. {isEn && sub.titleEn ? sub.titleEn : sub.title}
                  </button>
                ))}
              </div>
            </div>

            {/* TẦNG 3: BẢNG XẾP HẠNG (LEADERBOARD) */}
            <div className="winner-board" style={{ position: 'relative', overflow: 'hidden', background: 'rgba(5, 13, 40, 0.4)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(212, 175, 55, 0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              {/* Bản đồ nền chỉ nằm trong Bảng xếp hạng */}
              <img src="/extracted_assets/map_bg.png" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', minWidth: '800px', opacity: 0.3, zIndex: 0, pointerEvents: 'none', mixBlendMode: 'screen' }} />
              
              <div className="winner-head" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <h3 className="apg-sec-heading" style={{ fontSize: '1.8rem', color: '#fff', textTransform: 'none', letterSpacing: '0' }}>{isEn && selectedSub?.titleEn ? selectedSub.titleEn : selectedSub?.title}</h3>
                  <div className="apg-hero-script" style={{ fontSize: '1.1rem', marginTop: '8px' }}>{isEn ? 'Top 10 Leading Nominees' : 'Top 10 đề cử dẫn đầu'}</div>
                </div>
                <div className="live-tag" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-400)', padding: '6px 14px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-200)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <span className="live-dot" style={{ width: '8px', height: '8px', background: '#ff3b30', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span> LIVE UPDATE
                </div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1, minHeight: '400px' }}>
                <AnimatePresence>
                  {/* PODIUM cho Top 3 */}
                  <div className="podium-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '60px',
                    alignItems: 'end',
                    position: 'relative',
                    paddingTop: '60px'
                  }}>
                    {top.slice(0, 3).map((n, i) => {
                      const isTop1 = i === 0;
                      const isTop2 = i === 1;
                      
                      const orderIndex = isTop1 ? 2 : isTop2 ? 1 : 3;
                      const baseImg = isTop1 ? 'top1_base.png' : isTop2 ? 'top2_base.png' : 'top3_base.png';
                      const ringImg = isTop1 ? 'top1_ring.png' : 'top2_ring.png';
                      const laurelLeft = isTop1 ? 'gold_laurel_left.png' : isTop2 ? 'blue_laurel_left.png' : 'bronze_laurel_left.png';
                      const laurelRight = isTop1 ? 'gold_laurel_right.png' : isTop2 ? 'blue_laurel_right.png' : 'bronze_laurel_right.png';
                      const textColor = isTop1 ? '#d4af37' : isTop2 ? '#94a3b8' : '#cd7f32';
                      const badgeGradient = isTop1 ? 'linear-gradient(135deg, #f6e6a8, #d4af37)' : isTop2 ? 'linear-gradient(135deg, #ffffff, #94a3b8)' : 'linear-gradient(135deg, #fcd34d, #cd7f32)';

                      return (
                        <div 
                          key={`wrapper-${n.id}`}
                          className={`podium-wrapper top${i+1}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            order: orderIndex,
                            position: 'relative',
                            width: '100%',
                            maxWidth: '320px',
                            margin: '0 auto'
                          }}
                        >
                          <motion.div 
                            layoutId={`card-${n.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ 
                              position: 'relative',
                              width: '100%',
                              aspectRatio: isTop1 ? '293/384' : isTop2 ? '293/386' : '301/392',
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center',
                              zIndex: isTop1 ? 10 : 5
                            }}
                          >
                            {/* Background Asset */}
                            <img src={`/extracted_assets/${baseImg}`} alt="Base" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, objectFit: 'contain' }} />

                            {/* Avatar & Ring Container (Exact 48.1% width, sticking out of top curve) */}
                            <div style={{ position: 'absolute', top: '-18%', left: '50%', transform: 'translateX(-50%)', width: '48.1%', aspectRatio: '141/147', zIndex: 5 }}>
                               
                               {/* Crown for Top 1 (130% width of the ring) */}
                               {isTop1 && (
                                 <img src="/extracted_assets/top1_crown.png" alt="Crown" style={{ position: 'absolute', top: '-48%', left: '50%', transform: 'translateX(-50%)', width: '130%', zIndex: 10, animation: 'float 3s ease-in-out infinite', objectFit: 'contain' }} />
                               )}

                               {/* Inner Avatar Image */}
                               <div style={{ width: '80%', height: '80%', position: 'absolute', top: '10%', left: '10%', borderRadius: '50%', overflow: 'hidden', zIndex: 6, background: '#050d28', border: '2px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
                                  <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                               </div>
                               
                               {/* Metallic Ring */}
                               <img src={`/extracted_assets/${ringImg}`} alt="Ring" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 7, filter: !isTop1 && !isTop2 ? 'hue-rotate(-160deg) saturate(1.5)' : 'none', objectFit: 'contain' }} />
                               
                               {/* Rank Badge */}
                               <div style={{ 
                                 position: 'absolute', 
                                 bottom: '-8%', 
                                 left: '50%', 
                                 transform: 'translateX(-50%)', 
                                 width: '28%', 
                                 aspectRatio: '1/1', 
                                 background: badgeGradient, 
                                 borderRadius: '50%', 
                                 border: 'none', 
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 justifyContent: 'center', 
                                 color: '#111', 
                                 fontWeight: '900', 
                                 fontSize: '1rem', 
                                 zIndex: 8,
                                 boxShadow: '0 4px 10px rgba(0,0,0,0.7), inset 0 0 5px rgba(255,255,255,0.7), inset 0 0 2px rgba(0,0,0,0.5)'
                               }}>
                                 {i + 1}
                               </div>
                            </div>

                            {/* Name Content */}
                            <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', textAlign: 'center', zIndex: 5 }}>
                               <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'Be Vietnam Pro', marginBottom: '4px' }}>Đề cử xuất sắc</div>
                               <div style={{ fontSize: '0.9rem', color: textColor, fontWeight: '700', fontFamily: 'Be Vietnam Pro', textShadow: '0 2px 4px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.name}</div>
                            </div>

                            {/* Vote Count Container */}
                            <div style={{ position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 6, width: '100%' }}>
                               <motion.strong
                                  key={n.votes}
                                  initial={{ color: '#fff', scale: 1.2 }}
                                  animate={{ color: textColor, scale: 1 }}
                                  style={{ fontSize: isTop1 ? '2.2rem' : '1.7rem', fontWeight: '800', fontFamily: 'Be Vietnam Pro', lineHeight: 1, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}
                               >
                                 {n.votes.toLocaleString('vi-VN')}
                               </motion.strong>
                               <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', marginTop: '6px', textTransform: 'uppercase' }}>{t('results.votes')}</span>
                            </div>

                            {/* Laurels Left & Right */}
                            <img src={`/extracted_assets/${laurelLeft}`} alt="Laurel Left" style={{ position: 'absolute', top: '60%', left: '4%', width: '35%', objectFit: 'contain', zIndex: 5 }} />
                            <img src={`/extracted_assets/${laurelRight}`} alt="Laurel Right" style={{ position: 'absolute', top: '60%', right: '4%', width: '35%', objectFit: 'contain', zIndex: 5 }} />

                          </motion.div>
                        </div>
                      );
                    })}
                  </div>

                  {/* DANH SÁCH cho Top 4-10 */}
                  <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {top.slice(3).map((n, idx) => {
                      const i = idx + 3; // true rank index (3 to 9)
                      const pct = (n.votes / max) * 100;
                      
                      return (
                        <motion.div 
                          layoutId={`card-${n.id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="lb-row" 
                          key={n.id}
                          style={{ 
                            background: 'rgba(10, 15, 35, 0.4)', 
                            borderRadius: '12px', 
                            padding: '12px 20px', 
                            display: 'flex', 
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            gap: '20px',
                            position: 'relative',
                            boxShadow: 'inset 0 -2px 10px rgba(255,255,255,0.02)'
                          }}
                        >
                          <div className="rank" style={{ 
                            fontSize: '1.4rem', 
                            fontWeight: '600', 
                            color: '#d4af37', 
                            fontFamily: 'Be Vietnam Pro',
                            width: '30px',
                            textAlign: 'center'
                          }}>
                            {i + 1}
                          </div>
                          
                          <div className="lb-avatar" style={{ 
                            width: '60px', 
                            height: '40px', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            flexShrink: 0, 
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', margin: 0 }}>{n.name}</h4>
                            {/* Gold Progress Bar */}
                            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${Math.max(10, (n.votes / max) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-400), var(--gold-200), #fff)', boxShadow: '0 0 10px var(--gold-200)' }}></div>
                            </div>
                          </div>


                          <div className="lb-votes" style={{ textAlign: 'right', minWidth: '90px', marginLeft: '20px' }}>
                            <motion.strong
                              key={n.votes}
                              initial={{ color: '#fff', scale: 1.2 }}
                              animate={{ color: '#fff', scale: 1 }}
                              style={{ fontFamily: 'Be Vietnam Pro', fontSize: '1.2rem', fontWeight: '600' }}
                            >
                              {n.votes.toLocaleString('vi-VN')}
                            </motion.strong>
                            <small style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{t('results.votes')}</small>
                          </div>
                          
                          {/* Right Arrow */}
                          <div style={{ color: 'rgba(212,175,55,0.5)', fontSize: '1.2rem', paddingLeft: '16px' }}>
                            ›
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>

          {/* Dải ruy băng ở đáy */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '80px', paddingBottom: '40px', position: 'relative', zIndex: 10 }}>
            <img src="/extracted_assets/bottom_ribbon.png" style={{ width: '100%', maxWidth: '600px', objectFit: 'contain' }} alt="Ribbon" />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
