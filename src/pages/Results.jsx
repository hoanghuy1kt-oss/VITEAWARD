import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { VOTE_CATEGORIES } from '../data/categories';

// Hàm tạo danh sách đề cử ảo cho mỗi hạng mục con
const generateDummyLeaderboard = (subId, subTitle, isEn) => {
  const images = [
    '/images/Backround.png',
    '/images/backround ket noi.png',
    '/images/backround phat trien.png',
    '/images/hero-collage.png',
    '/images/Backround truyen cam hung.png'
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
      <section id="winners" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh' }}>
        <div className="container">
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
            <div className="winner-board" style={{ background: 'rgba(5, 13, 40, 0.4)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(212, 175, 55, 0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <div className="winner-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <h3 className="apg-sec-heading" style={{ fontSize: '1.8rem', color: '#fff', textTransform: 'none', letterSpacing: '0' }}>{isEn && selectedSub?.titleEn ? selectedSub.titleEn : selectedSub?.title}</h3>
                  <div className="apg-hero-script" style={{ fontSize: '1.1rem', marginTop: '8px' }}>{isEn ? 'Top 10 Leading Nominees' : 'Top 10 đề cử dẫn đầu'}</div>
                </div>
                <div className="live-tag" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-400)', padding: '6px 14px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-200)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <span className="live-dot" style={{ width: '8px', height: '8px', background: '#ff3b30', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span> LIVE UPDATE
                </div>
              </div>
              
              <div style={{ position: 'relative', minHeight: '400px' }}>
                <AnimatePresence>
                  {/* PODIUM cho Top 3 */}
                  <div className="podium-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '16px', 
                    marginBottom: '60px',
                    alignItems: 'end',
                    position: 'relative',
                    paddingTop: '60px'
                  }}>
                    {/* Spotlights */}
                    <div className="spotlight" style={{ position: 'absolute', bottom: '0', left: '10%', width: '200px', height: '150%', background: 'linear-gradient(0deg, rgba(255,255,255,0.03) 0%, transparent 100%)', transform: 'skewX(-25deg)', transformOrigin: 'bottom', pointerEvents: 'none', zIndex: 0 }} />
                    <div className="spotlight" style={{ position: 'absolute', bottom: '0', right: '10%', width: '200px', height: '150%', background: 'linear-gradient(0deg, rgba(255,255,255,0.03) 0%, transparent 100%)', transform: 'skewX(25deg)', transformOrigin: 'bottom', pointerEvents: 'none', zIndex: 0 }} />
                    <div className="spotlight" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150%', background: 'linear-gradient(0deg, rgba(212,175,55,0.06) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 0 }} />

                    {top.slice(0, 3).map((n, i) => {
                      const pct = (n.votes / max) * 100;
                      const isTop1 = i === 0;
                      const isTop2 = i === 1;
                      const isTop3 = i === 2;
                      const rankClass = isTop1 ? 'top1' : isTop2 ? 'top2' : 'top3';
                      const orderIndex = isTop1 ? 2 : isTop2 ? 1 : 3;

                      return (
                        <div 
                          key={`wrapper-${n.id}`}
                          className={`podium-wrapper top${i+1}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            order: orderIndex,
                            position: 'relative'
                          }}
                        >
                          <motion.div 
                            layoutId={`card-${n.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`lb-podium-card ${rankClass}`} 
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '100%',
                              position: 'relative',
                              zIndex: isTop1 ? 10 : 5
                            }}
                          >
                            {/* Avatar Phần chóp */}
                            <div style={{ position: 'relative', marginBottom: '-40px', zIndex: 3 }}>
                              <div className="lb-avatar" style={{ 
                                width: isTop1 ? '110px' : '90px', 
                                height: isTop1 ? '110px' : '90px', 
                                borderRadius: '50%', 
                                overflow: 'hidden', 
                                border: isTop1 ? '3px solid rgba(212,175,55,0.8)' : isTop2 ? '3px solid rgba(192,192,192,0.6)' : '3px solid rgba(205,127,50,0.6)',
                                boxShadow: isTop1 ? '0 0 20px rgba(212,175,55,0.5)' : '0 0 15px rgba(0,0,0,0.5)',
                                margin: '0 auto',
                                background: '#050d28',
                                position: 'relative'
                              }}>
                                <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              
                              {/* Vương miện cho Top 1 */}
                              {isTop1 && (
                                <div style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', width: '50px', filter: 'drop-shadow(0 4px 8px rgba(212,175,55,0.6))', animation: 'float 3s ease-in-out infinite' }}>
                                  <svg viewBox="0 0 24 24" fill="url(#gold-gradient)" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                      <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f6e6a8" />
                                        <stop offset="50%" stopColor="#d4af37" />
                                        <stop offset="100%" stopColor="#aa7c11" />
                                      </linearGradient>
                                    </defs>
                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                                  </svg>
                                </div>
                              )}

                              {/* Rank badge overlap */}
                              <div className="rank-badge" style={{
                                position: 'absolute',
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#111',
                                color: isTop1 ? '#d4af37' : isTop2 ? '#e2e8f0' : '#cd7f32',
                                width: isTop1 ? '32px' : '28px',
                                height: isTop1 ? '32px' : '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: isTop1 ? '16px' : '14px',
                                border: isTop1 ? '2px solid rgba(212,175,55,0.6)' : isTop2 ? '2px solid rgba(192,192,192,0.4)' : '2px solid rgba(205,127,50,0.4)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                                zIndex: 4
                              }}>
                                {i + 1}
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="podium-block" style={{
                              width: '100%',
                              background: isTop1 ? 'linear-gradient(180deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)' 
                                        : isTop2 ? 'linear-gradient(180deg, rgba(192,192,192,0.08) 0%, rgba(192,192,192,0.02) 100%)' 
                                        : 'linear-gradient(180deg, rgba(205,127,50,0.08) 0%, rgba(205,127,50,0.02) 100%)',
                              borderRadius: '16px',
                              backdropFilter: 'blur(16px)',
                              WebkitBackdropFilter: 'blur(16px)',
                              border: isTop1 ? '1px solid rgba(212,175,55,0.4)' : isTop2 ? '1px solid rgba(192,192,192,0.3)' : '1px solid rgba(205,127,50,0.3)',
                              borderBottom: isTop1 ? '8px solid rgba(212,175,55,0.9)' : isTop2 ? '8px solid rgba(192,192,192,0.7)' : '8px solid rgba(205,127,50,0.7)',
                              boxShadow: isTop1 ? '0 10px 30px rgba(212, 175, 55, 0.1), inset 0 0 20px rgba(212,175,55,0.05)' 
                                       : isTop2 ? '0 10px 20px rgba(192, 192, 192, 0.05)'
                                       : '0 10px 20px rgba(205, 127, 50, 0.05)',
                              paddingTop: '60px',
                              paddingBottom: '24px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              position: 'relative',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              zIndex: 1
                            }}>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontFamily: 'Be Vietnam Pro' }}>
                                Đề cử xuất sắc
                              </div>
                              <div className="lb-name" style={{ 
                                fontWeight: '600', 
                                color: isTop1 ? '#d4af37' : '#fff', 
                                fontSize: '1.1rem', 
                                fontFamily: 'Be Vietnam Pro',
                                textAlign: 'center',
                                zIndex: 2,
                                textShadow: isTop1 ? '0 2px 4px rgba(212,175,55,0.3)' : 'none',
                                marginBottom: '16px'
                              }}>
                                {n.name}
                              </div>

                              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* Laurel Wreath Left */}
                                {isTop1 && (
                                  <svg style={{ position: 'absolute', left: '10px', width: '40px', opacity: 0.6 }} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M90 140 C50 120, 20 80, 20 30" stroke="#d4af37" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                                    <path d="M20 30 Q10 20 20 10 Q30 20 20 30" fill="#d4af37" />
                                    <path d="M25 60 Q10 50 25 40 Q40 50 25 60" fill="#d4af37" />
                                    <path d="M35 90 Q15 80 35 70 Q55 80 35 90" fill="#d4af37" />
                                    <path d="M55 120 Q35 110 55 100 Q75 110 55 120" fill="#d4af37" />
                                  </svg>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                                  <motion.strong
                                    key={n.votes}
                                    initial={{ color: '#fff', scale: 1.2 }}
                                    animate={{ color: isTop1 ? '#d4af37' : isTop2 ? '#e2e8f0' : '#cd7f32', scale: 1 }}
                                    style={{ fontFamily: 'Be Vietnam Pro', fontSize: isTop1 ? '2.4rem' : '1.8rem', fontWeight: '700', lineHeight: 1 }}
                                  >
                                    {n.votes.toLocaleString('vi-VN')}
                                  </motion.strong>
                                  <small style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>{t('results.votes')}</small>
                                </div>

                                {/* Laurel Wreath Right */}
                                {isTop1 && (
                                  <svg style={{ position: 'absolute', right: '10px', width: '40px', opacity: 0.6, transform: 'scaleX(-1)' }} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M90 140 C50 120, 20 80, 20 30" stroke="#d4af37" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                                    <path d="M20 30 Q10 20 20 10 Q30 20 20 30" fill="#d4af37" />
                                    <path d="M25 60 Q10 50 25 40 Q40 50 25 60" fill="#d4af37" />
                                    <path d="M35 90 Q15 80 35 70 Q55 80 35 90" fill="#d4af37" />
                                    <path d="M55 120 Q35 110 55 100 Q75 110 55 120" fill="#d4af37" />
                                  </svg>
                                )}
                              </div>
                            </div>
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
                            background: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: '12px', 
                            padding: '12px 20px', 
                            display: 'flex', 
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            gap: '20px',
                            position: 'relative'
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
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            flexShrink: 0, 
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div className="lb-name" style={{ 
                              fontWeight: '400', 
                              color: '#fff', 
                              fontSize: '1rem', 
                              fontFamily: 'Be Vietnam Pro'
                            }}>
                              {n.name}
                            </div>
                            <div className="lb-bar" style={{ display: 'block', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden', width: '100%' }}>
                              <motion.div 
                                className="lb-bar-fill" 
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.5 }}
                                style={{ 
                                  height: '100%', 
                                  background: 'linear-gradient(90deg, #d4af37, #f6e6a8)', 
                                  borderRadius: '99px'
                                }}
                              />
                            </div>
                          </div>

                          <div className="lb-votes" style={{ textAlign: 'right', minWidth: '90px' }}>
                            <motion.strong
                              key={n.votes}
                              initial={{ color: '#fff', scale: 1.2 }}
                              animate={{ color: '#fff', scale: 1 }}
                              style={{ fontFamily: 'Be Vietnam Pro', fontSize: '1.2rem', fontWeight: '500' }}
                            >
                              {n.votes.toLocaleString('vi-VN')}
                            </motion.strong>
                            <small style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('results.votes')}</small>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
