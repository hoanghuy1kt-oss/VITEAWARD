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
                    gap: '24px', 
                    marginBottom: '40px',
                    alignItems: 'end' 
                  }}>
                    {top.slice(0, 3).map((n, i) => {
                      const pct = (n.votes / max) * 100;
                      const isTop1 = i === 0;
                      const isTop2 = i === 1;
                      const isTop3 = i === 2;
                      const rankClass = isTop1 ? 'top1' : isTop2 ? 'top2' : 'top3';
                      // Sắp xếp thứ tự: Rank 2 bên trái, Rank 1 ở giữa, Rank 3 bên phải
                      const orderIndex = isTop1 ? 2 : isTop2 ? 1 : 3;

                      return (
                        <motion.div 
                          layoutId={`card-${n.id}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className={`lb-podium-card ${rankClass}`} 
                          key={n.id}
                          style={{ 
                            order: orderIndex,
                            height: isTop1 ? '340px' : '300px',
                            background: isTop1 ? 'linear-gradient(180deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.02) 100%)' 
                                      : isTop2 ? 'linear-gradient(180deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.02) 100%)' 
                                      : 'linear-gradient(180deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.02) 100%)', 
                            borderRadius: '24px', 
                            padding: '30px 20px 24px', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: isTop1 ? '1px solid rgba(212, 175, 55, 0.5)' 
                                  : isTop2 ? '1px solid rgba(192, 192, 192, 0.4)' 
                                  : '1px solid rgba(205, 127, 50, 0.4)',
                            boxShadow: isTop1 ? '0 10px 40px rgba(212, 175, 55, 0.15)' 
                                     : isTop2 ? '0 10px 30px rgba(192, 192, 192, 0.1)'
                                     : '0 10px 30px rgba(205, 127, 50, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            textAlign: 'center'
                          }}
                        >
                          {isTop1 && (
                            <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', transform: 'skewX(-20deg)', animation: 'shimmer 3s infinite' }} />
                          )}

                          <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <div className="lb-avatar" style={{ 
                              width: isTop1 ? '100px' : '85px', 
                              height: isTop1 ? '100px' : '85px', 
                              borderRadius: '50%', 
                              overflow: 'hidden', 
                              border: isTop1 ? '3px solid #d4af37' : isTop2 ? '3px solid #e2e8f0' : '3px solid #cd7f32',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                              margin: '0 auto'
                            }}>
                              <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="rank-badge" style={{
                              position: 'absolute',
                              bottom: '-10px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: isTop1 ? 'linear-gradient(135deg, #f6e6a8, #d4af37)' : isTop2 ? 'linear-gradient(135deg, #f3f4f6, #94a3b8)' : 'linear-gradient(135deg, #fcd34d, #cd7f32)',
                              color: '#111',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '900',
                              fontSize: '14px',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                              border: '2px solid #050d28'
                            }}>
                              {i + 1}
                            </div>
                          </div>
                          
                          <div className="lb-name" style={{ 
                            fontWeight: '400', 
                            color: isTop1 ? 'var(--gold-200)' : '#fff', 
                            fontSize: isTop1 ? '1.2rem' : '1.1rem', 
                            fontFamily: 'Be Vietnam Pro',
                            letterSpacing: '0.5px',
                            lineHeight: '1.4',
                            marginBottom: 'auto',
                            padding: '0 10px'
                          }}>
                            {n.name}
                          </div>

                          <div className="lb-votes-podium" style={{ marginTop: '16px', width: '100%' }}>
                            <motion.strong
                              key={n.votes}
                              initial={{ color: '#fff', scale: 1.2 }}
                              animate={{ color: isTop1 ? 'var(--gold-300)' : isTop2 ? '#e2e8f0' : '#fcd34d', scale: 1 }}
                              style={{ fontFamily: 'Be Vietnam Pro', fontSize: isTop1 ? '2rem' : '1.6rem', fontWeight: '400', display: 'block', lineHeight: 1 }}
                            >
                              {n.votes.toLocaleString('vi-VN')}
                            </motion.strong>
                            <small style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', marginBottom: '12px' }}>{t('results.votes')}</small>
                            
                            <div className="lb-bar" style={{ display: 'block', width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                              <motion.div 
                                className="lb-bar-fill" 
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.5 }}
                                style={{ 
                                  height: '100%', 
                                  background: isTop1 ? 'linear-gradient(90deg, #d4af37, #f6e6a8)' 
                                            : isTop2 ? 'linear-gradient(90deg, #94a3b8, #e2e8f0)' 
                                            : 'linear-gradient(90deg, #cd7f32, #fcd34d)', 
                                  borderRadius: '99px',
                                  boxShadow: '0 0 10px rgba(255,255,255,0.2)'
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* DANH SÁCH cho Top 4-10 */}
                  <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                            background: 'rgba(255, 255, 255, 0.02)', 
                            borderRadius: '12px', 
                            padding: '12px 20px', 
                            display: 'flex', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            border: '1px solid transparent',
                            gap: '16px',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <div className="rank" style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: '400', 
                            textAlign: 'center', 
                            width: '40px', 
                            color: 'var(--text-muted)', 
                            fontFamily: 'Be Vietnam Pro'
                          }}>
                            #{i + 1}
                          </div>
                          
                          <div className="lb-info" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 200px' }}>
                            <div className="lb-avatar" style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '8px', 
                              overflow: 'hidden', 
                              flexShrink: 0, 
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                              <img src={n.image} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="lb-name" style={{ 
                              fontWeight: '400', 
                              color: '#fff', 
                              fontSize: '0.95rem', 
                              fontFamily: 'Be Vietnam Pro',
                              letterSpacing: '0.5px'
                            }}>
                              {n.name}
                            </div>
                          </div>

                          <div className="lb-bar" style={{ display: 'block', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden', flex: '1 1 120px', maxWidth: '200px' }}>
                            <motion.div 
                              className="lb-bar-fill" 
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5 }}
                              style={{ 
                                height: '100%', 
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.4))', 
                                borderRadius: '99px'
                              }}
                            />
                          </div>

                          <div className="lb-votes" style={{ textAlign: 'right', minWidth: '90px' }}>
                            <motion.strong
                              key={n.votes}
                              initial={{ color: '#fff', scale: 1.2 }}
                              animate={{ color: '#fff', scale: 1 }}
                              style={{ fontFamily: 'Be Vietnam Pro', fontSize: '1.1rem', fontWeight: '400' }}
                            >
                              {n.votes.toLocaleString('vi-VN')}
                            </motion.strong>
                            <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{t('results.votes')}</small>
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
