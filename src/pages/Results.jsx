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
                  {top.map((n, i) => {
                    const pct = (n.votes / max) * 100;
                    const rankClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
                    
                    // Design variables based on rank
                    const isTop1 = i === 0;
                    const isTop2 = i === 1;
                    const isTop3 = i === 2;
                    const isTop3Any = i < 3;

                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`lb-row ${rankClass}`} 
                        key={n.id}
                        style={{ 
                          marginBottom: isTop3Any ? '20px' : '12px', 
                          background: isTop1 ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.02) 100%)' 
                                    : isTop2 ? 'linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.02) 100%)' 
                                    : isTop3 ? 'linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.02) 100%)' 
                                    : 'rgba(255, 255, 255, 0.02)', 
                          borderRadius: '16px', 
                          padding: isTop1 ? '24px 20px' : isTop3Any ? '20px' : '16px 20px', 
                          display: 'flex', 
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          border: isTop1 ? '1px solid rgba(212, 175, 55, 0.5)' 
                                : isTop2 ? '1px solid rgba(192, 192, 192, 0.4)' 
                                : isTop3 ? '1px solid rgba(205, 127, 50, 0.4)' 
                                : '1px solid transparent',
                          boxShadow: isTop1 ? '0 10px 40px rgba(212, 175, 55, 0.15)' 
                                   : isTop2 ? '0 10px 30px rgba(192, 192, 192, 0.1)'
                                   : isTop3 ? '0 10px 30px rgba(205, 127, 50, 0.1)'
                                   : 'none',
                          gap: '16px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Shimmer effect for Top 1 */}
                        {isTop1 && (
                          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', transform: 'skewX(-20deg)', animation: 'shimmer 3s infinite' }} />
                        )}

                        <div className="rank" style={{ 
                          fontSize: isTop1 ? '2.5rem' : isTop3Any ? '2rem' : '1.2rem', 
                          fontWeight: '400', 
                          textAlign: 'center', 
                          width: '50px', 
                          color: isTop1 ? '#d4af37' : isTop2 ? '#e2e8f0' : isTop3 ? '#cd7f32' : 'var(--text-muted)', 
                          fontFamily: 'Be Vietnam Pro',
                          textShadow: isTop3Any ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
                          lineHeight: 1
                        }}>
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : '#' + (i + 1)}
                        </div>
                        
                        <div className="lb-info" style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 250px' }}>
                          <div className="lb-avatar" style={{ 
                            width: isTop1 ? '70px' : isTop3Any ? '60px' : '45px', 
                            height: isTop1 ? '70px' : isTop3Any ? '60px' : '45px', 
                            borderRadius: isTop1 ? '50%' : '12px', 
                            overflow: 'hidden', 
                            flexShrink: 0, 
                            border: isTop1 ? '2px solid #d4af37' : isTop2 ? '2px solid #e2e8f0' : isTop3 ? '2px solid #cd7f32' : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: isTop3Any ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
                          }}>
                            <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div className="lb-name" style={{ 
                              fontWeight: '400', 
                              color: isTop1 ? 'var(--gold-200)' : '#fff', 
                              fontSize: isTop1 ? '1.2rem' : isTop3Any ? '1.1rem' : '1rem', 
                              fontFamily: 'Be Vietnam Pro',
                              letterSpacing: '0.5px'
                            }}>
                              {n.name}
                            </div>
                          </div>
                        </div>

                        <div className="lb-bar" style={{ display: 'block', width: '100%', height: isTop3Any ? '10px' : '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden', flex: '1 1 150px', maxWidth: '250px' }}>
                          <motion.div 
                            className="lb-bar-fill" 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                            style={{ 
                              height: '100%', 
                              background: isTop1 ? 'linear-gradient(90deg, #d4af37, #f6e6a8)' 
                                        : isTop2 ? 'linear-gradient(90deg, #94a3b8, #e2e8f0)' 
                                        : isTop3 ? 'linear-gradient(90deg, #cd7f32, #fcd34d)' 
                                        : 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5))', 
                              borderRadius: '99px',
                              boxShadow: isTop3Any ? '0 0 10px rgba(255,255,255,0.2)' : 'none'
                            }}
                          />
                        </div>

                        <div className="lb-votes" style={{ textAlign: 'right', minWidth: '100px' }}>
                          <motion.strong
                            key={n.votes}
                            initial={{ color: '#fff', scale: 1.2 }}
                            animate={{ color: isTop1 ? 'var(--gold-300)' : isTop2 ? '#e2e8f0' : isTop3 ? '#fcd34d' : 'var(--gold-200)', scale: 1 }}
                            style={{ fontFamily: 'Be Vietnam Pro', fontSize: isTop1 ? '1.6rem' : isTop3Any ? '1.4rem' : '1.2rem', fontWeight: '400' }}
                          >
                            {n.votes.toLocaleString('vi-VN')}
                          </motion.strong>
                          <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{t('results.votes')}</small>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
