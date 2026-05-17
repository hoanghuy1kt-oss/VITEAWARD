import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { VOTE_CATEGORIES } from '../data/categories';

const generateDummyLeaderboard = (subId, subTitle, isEn) => {
  const images = [
    'https://picsum.photos/seed/halong/600/400',
    'https://picsum.photos/seed/citynight/600/400',
    'https://picsum.photos/seed/terrace99/600/400',
    'https://picsum.photos/seed/resort88/600/400',
    'https://picsum.photos/seed/beach55/600/400',
    'https://picsum.photos/seed/mountain33/600/400',
    'https://picsum.photos/seed/roadtrip/600/400',
    'https://picsum.photos/seed/waterfall7/600/400',
    'https://picsum.photos/seed/balloon9/600/400',
    'https://picsum.photos/seed/seascape2/600/400',
  ];
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `${subId}-n${i + 1}`,
    name: `Tên Đề Cử Số ${(i + 1).toString().padStart(2, '0')}`,
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

  // Dropdown state & logic
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // New CARD_CFG mapping
  const CARD_CFG = [
    { entry: 1, left: '18.5%', top: '18%', cardW: '31%', ringW: '46%', rank: 2, type: 'silver' },
    { entry: 0, left: '50%',   top: '12%', cardW: '34%', ringW: '48%', rank: 1, type: 'gold'   },
    { entry: 2, left: '81.5%', top: '18%', cardW: '31%', ringW: '46%', rank: 3, type: 'bronze' },
  ];
  const RING_IMGS = ['/extracted_assets/top1_ring.png', '/extracted_assets/top2_ring.png', '/extracted_assets/top2_ring.png'];
  const RING_FILTER = ['none', 'none', 'hue-rotate(-160deg) saturate(1.5)'];

  // Format title into two lines
  const formatTitle = (text) => {
    if (!text) return { line1: '', line2: '' };
    const words = text.split(' ');
    if (words.length <= 3) return { line1: text, line2: '' };
    const mid = Math.ceil(words.length / 2);
    return {
      line1: words.slice(0, mid).join(' '),
      line2: words.slice(mid).join(' ')
    };
  };
  const titleText = isEn && selectedSub?.titleEn ? selectedSub.titleEn : selectedSub?.title;
  const { line1, line2 } = formatTitle(titleText);

  return (
    <PageTransition>
      <section id="winners" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh', position: 'relative' }}>
        <style>{`
          /* ── Podium Buc ── */
          .podium-buc { position: relative; width: 100%; max-width: 850px; margin: 0 auto 24px auto; background: var(--navy); border-radius: 12px; overflow: visible; }
          .buc-img { width: 100%; display: block; height: auto; }
          
          /* Crown floats above gold card center */
          .buc-crown {
            position: absolute; left: 50%; top: -1%;
            transform: translateX(-50%);
            width: 10%; z-index: 15; pointer-events: none;
            filter: drop-shadow(0 2px 10px rgba(212,175,55,.9));
            animation: floatCrown 3s ease-in-out infinite;
          }
          @keyframes floatCrown { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-5px)} }
          
          /* Overlay for each card */
          .buc-card {
            position: absolute; transform: translateX(-50%) !important;
            display: flex; flex-direction: column; align-items: center;
            z-index: 10;
          }
          
          /* Ring + photo */
          .buc-ring-wrap { position: relative; width: 100%; aspect-ratio: 1; flex-shrink: 0; }
          .buc-photo {
            position: absolute; top: 10%; left: 10%; width: 80%; height: 80%;
            border-radius: 50%; overflow: hidden; background: #050d28;
            box-shadow: inset 0 0 8px rgba(0,0,0,.9);
          }
          .buc-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .buc-ring {
            position: absolute; inset: 0; width: 100%; height: 100%;
            object-fit: contain; z-index: 2; pointer-events: none;
          }
          .buc-rank {
            position: absolute; bottom: -6%; left: 50%; transform: translateX(-50%);
            width: 28%; aspect-ratio: 1; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 900; color: #111; z-index: 3;
            box-shadow: 0 3px 8px rgba(0,0,0,.6), inset 0 0 4px rgba(255,255,255,.6);
            font-size: .75rem;
          }
          .buc-rank-gold   { background: linear-gradient(135deg, #f6e6a8, #d4af37); font-size: .9rem; }
          .buc-rank-silver { background: linear-gradient(135deg, #fff, #94a3b8); }
          .buc-rank-bronze { background: linear-gradient(135deg, #fcd34d, #cd7f32); }
          
          /* Text overlay */
          .buc-sub  { font-size: clamp(0.6rem, 1.3vw, 0.85rem); color: rgba(255,255,255,.5); margin-top: clamp(24px, 4vw, 38px); text-align: center; text-transform: uppercase; letter-spacing: 1px; width: 90%; }
          .buc-name { 
            font-weight: 700; font-size: clamp(0.75rem, 1.6vw, 1.05rem); line-height: 1.3; 
            text-align: center; margin-top: 4px; width: 95%; max-width: 220px;
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
            word-wrap: break-word;
          }
          .buc-name-gold   { color: var(--gold-200); font-size: clamp(0.85rem, 1.8vw, 1.25rem); max-width: 260px; }
          .buc-name-silver { color: #cbd5e1; }
          .buc-name-bronze { color: #f6c768; }
          .buc-votes { font-weight: 800; line-height: 1; text-align: center; margin-top: 8px; text-shadow: 0 2px 6px rgba(0,0,0,.7); }
          .buc-votes-gold   { font-size: clamp(1.5rem, 5vw, 2.8rem); color: var(--gold-200); }
          .buc-votes-silver { font-size: clamp(1.2rem, 4vw, 2.2rem); color: #cbd5e1; }
          .buc-votes-bronze { font-size: clamp(1.2rem, 4vw, 2.2rem); color: #f6c768; }
          .buc-vote-lbl { font-size: clamp(0.55rem, 1.2vw, 0.8rem); color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
          
          /* ── Gold divider ── */
          .gold-divider {
            height: 2px; margin: 8px 0 20px;
            background: linear-gradient(90deg, transparent, var(--gold-400) 20%, var(--gold-200) 50%, var(--gold-400) 80%, transparent);
            box-shadow: 0 0 12px rgba(212,175,55,.3); border-radius: 999px;
          }

          /* ── Title Header ── */
          .lb-header { text-align: center; margin-bottom: 40px; position: relative; z-index: 2; width: 100%; }
          .lb-tagline { 
            display: flex; align-items: center; justify-content: center; gap: 20px; 
            margin-bottom: 16px; position: relative;
          }
          .lb-tagline span {
            font-size: 0.9rem; letter-spacing: 4px; color: var(--gold-200);
            text-transform: uppercase; font-weight: 600; font-style: italic;
            font-family: 'Be Vietnam Pro', sans-serif;
          }
          .lb-tagline::before, .lb-tagline::after {
            content: ''; height: 1px; width: 60px;
            background: linear-gradient(90deg, transparent, var(--gold-400));
          }
          .lb-tagline::after { background: linear-gradient(-90deg, transparent, var(--gold-400)); }
          
          .live-tag {
            position: absolute; right: 0; top: 50%; transform: translateY(-50%);
            background: rgba(212,175,55,0.1); border: 1px solid var(--gold-400);
            padding: 6px 14px; border-radius: 100px;
            display: flex; align-items: center; gap: 8px;
            color: var(--gold-200); font-size: 0.8rem; font-weight: bold;
          }
          .live-dot { width: 8px; height: 8px; background: #ff3b30; border-radius: 50%; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,59,48,0.7); } 70% { box-shadow: 0 0 0 6px rgba(255,59,48,0); } 100% { box-shadow: 0 0 0 0 rgba(255,59,48,0); } }

          .lb-title {
            font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; line-height: 1.3;
            color: #fff; text-transform: uppercase; margin-bottom: 24px;
            text-shadow: 0 4px 20px rgba(0,0,0,0.5); font-family: 'Playfair Display', 'Be Vietnam Pro', serif;
            padding-top: 10px;
          }
          
          /* Ngăn text-shadow phá vỡ hiệu ứng background-clip: text của gold-text */
          .lb-title .gold-text {
            text-shadow: none;
          }
          
          /* ── Subtitle Pill (Exact match) ── */
          .lb-subtitle {
            display: inline-flex; align-items: center; gap: 12px;
            padding: 10px 28px; border-radius: 100px;
            background: #23252b; border: 1px solid #c7a450;
            color: #f1dd8a; font-weight: 800; font-size: 1.05rem; letter-spacing: 1.5px;
            font-family: 'Be Vietnam Pro', sans-serif; text-transform: uppercase;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }
          .lb-subtitle img { width: 32px; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); margin-left: -6px; }
          
          /* ── List rows 4–10 ── */
          .list-rows { display: flex; flex-direction: column; gap: 12px; }
          
          .list-row {
            display: flex; align-items: center; gap: 20px;
            background: rgba(8,15,40,.55);
            border: 1px solid rgba(255,255,255,.05);
            border-radius: 16px; padding: 16px 24px;
            transition: background .2s, border-color .2s;
          }
          .list-row:hover { background: rgba(212,175,55,.07); border-color: rgba(212,175,55,.2); }
          
          .list-rank { font-size: 1.8rem; font-weight: 700; color: var(--gold-400); width: 40px; text-align: center; flex-shrink: 0; }
          
          .list-thumb { width: 90px; height: 60px; border-radius: 10px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(255,255,255,.1); }
          .list-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
          
          .list-info { flex: 1; min-width: 0; }
          .list-name { font-weight: 600; font-size: 1.15rem; color: #fff; line-height: 1.4; }
          .list-bar-wrap { margin-top: 10px; height: 5px; background: rgba(255,255,255,.08); border-radius: 999px; overflow: hidden; }
          .list-bar { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--gold-400), var(--gold-200), #fff); box-shadow: 0 0 8px var(--gold-200); transition: width 1.2s cubic-bezier(.4,0,.2,1); }
          
          .list-votes { text-align: right; flex-shrink: 0; }
          .list-votes strong { font-size: 1.4rem; font-weight: 700; color: #fff; display: block; }
          .list-votes small { font-size: .75rem; color: rgba(255,255,255,.4); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; display: block; }

          /* ── Premium Dropdown Menu (Integrated into Tagline) ── */
          .custom-select-wrapper {
            position: relative; display: inline-flex; justify-content: center;
            z-index: 50; margin-bottom: 16px; width: 100%;
          }
          .custom-select-btn {
            display: inline-flex; align-items: center; gap: 8px;
            background: transparent; border: none; cursor: pointer;
            position: relative;
          }
          .custom-select-btn span {
            font-size: 0.9rem; letter-spacing: 3px; color: var(--gold-200);
            text-transform: uppercase; font-weight: 600; font-style: italic;
            font-family: 'Be Vietnam Pro', sans-serif;
            transition: color 0.2s;
          }
          .custom-select-btn:hover span { color: var(--gold-400); text-shadow: 0 0 10px rgba(212,175,55,0.4); }
          
          /* Gold lines on the sides */
          .custom-select-btn::before, .custom-select-btn::after {
            content: ''; height: 1px; width: 60px;
            background: linear-gradient(90deg, transparent, var(--gold-400));
            position: absolute; top: 50%; transform: translateY(-50%);
          }
          .custom-select-btn::before { right: 100%; margin-right: 20px; }
          .custom-select-btn::after { left: 100%; margin-left: 20px; background: linear-gradient(-90deg, transparent, var(--gold-400)); }
          
          .custom-select-btn .chevron { transition: transform 0.3s; color: var(--gold-200); }
          .custom-select-btn.open .chevron { transform: rotate(180deg); }
          
          .custom-select-menu {
            position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%) translateY(-10px);
            width: max-content; min-width: 320px; max-width: 90vw;
            background: rgba(10, 15, 36, 0.98); backdrop-filter: blur(16px);
            border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px;
            padding: 12px; display: flex; flex-direction: column; gap: 4px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            max-height: 400px; overflow-y: auto;
            opacity: 0; visibility: hidden; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .custom-select-menu.open {
            opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0);
          }
          
          .custom-select-menu::-webkit-scrollbar { width: 6px; }
          .custom-select-menu::-webkit-scrollbar-track { background: transparent; }
          .custom-select-menu::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.4); border-radius: 10px; }
          .custom-select-menu::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.7); }

          .custom-select-item {
            padding: 12px 20px; border-radius: 12px; background: transparent;
            border: none; color: #cbd5e1; font-size: 0.95rem; text-align: left;
            cursor: pointer; transition: all 0.2s; font-family: 'Be Vietnam Pro', sans-serif;
            display: flex; align-items: center; gap: 10px;
          }
          .custom-select-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
          .custom-select-item.active {
            background: rgba(212,175,55,0.15); color: var(--gold-200); font-weight: 600;
          }
          .custom-select-item.active::before {
            content: '✓'; color: var(--gold-400); font-weight: bold; margin-left: -4px;
          }
        `}</style>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            {/* TẦNG 1: TAB NHÓM LỚN - ĐƯA LÊN TRÊN */}
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

            {/* TẦNG 2 & 3: BẢNG XẾP HẠNG (LEADERBOARD) - TÍCH HỢP CHỌN HẠNG MỤC */}
            <div style={{ position: 'relative', overflow: 'visible', padding: '10px 0' }}>
              
              <div className="lb-header">
                
                {/* INTERACTIVE TAGLINE AS DROPDOWN */}
                <div className="custom-select-wrapper" ref={dropdownRef}>
                  <button 
                    className={`custom-select-btn ${isDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{isEn ? 'SELECT CATEGORY' : 'CHỌN HẠNG MỤC'}</span>
                    <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px', marginTop: '2px' }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  <div className="live-tag">
                    <span className="live-dot"></span> LIVE UPDATE
                  </div>
                  
                  <div className={`custom-select-menu ${isDropdownOpen ? 'open' : ''}`}>
                    {activeCategory.items.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSub(sub);
                          setIsDropdownOpen(false);
                        }}
                        className={`custom-select-item ${selectedSub?.id === sub.id ? 'active' : ''}`}
                      >
                        {isEn && sub.titleEn ? sub.titleEn : sub.title}
                      </button>
                    ))}
                  </div>
                </div>
                
                <h2 className="lb-title">
                  {line1}
                  {line2 && (
                    <>
                      <br />
                      <span className="gold-text">{line2}</span>
                    </>
                  )}
                </h2>
                
                {/* EXACT PILL MATCH */}
                <div className="lb-subtitle">
                  <img src="/extracted_assets/top1_crown.png" alt="Crown" />
                  {isEn ? 'TOP 10 LEADING NOMINEES' : 'TOP 10 ĐỀ CỬ DẪN ĐẦU'}
                </div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1, minHeight: '400px' }}>
                <AnimatePresence>
                  
                  {/* PODIUM cho Top 3 */}
                  <div className="podium-buc">
                    <img className="buc-img" src="/extracted_assets/Buc.png" alt="" />
                    <img className="buc-crown" src="/extracted_assets/top1_crown.png" alt="" />
                    
                    {CARD_CFG.map(cfg => {
                      const e = top[cfg.entry];
                      if (!e) return null;
                      return (
                        <div key={e.id} className="buc-card" style={{ left: cfg.left, top: cfg.top, width: cfg.cardW }}>
                          <div className="buc-ring-wrap" style={{ width: cfg.ringW, margin: '0 auto' }}>
                            <div className="buc-photo"><img src={e.image} alt={e.name} loading="lazy" /></div>
                            <img className="buc-ring" src={RING_IMGS[cfg.entry]} alt="" style={{ filter: RING_FILTER[cfg.entry] }} />
                            <div className={`buc-rank buc-rank-${cfg.type}`}>{cfg.rank}</div>
                          </div>
                          <div className="buc-sub">{isEn ? 'Outstanding Nominee' : 'Đề cử xuất sắc'}</div>
                          <div className={`buc-name buc-name-${cfg.type}`} title={e.name}>{e.name}</div>
                          <motion.div 
                            className={`buc-votes buc-votes-${cfg.type}`}
                            key={e.votes}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            {e.votes.toLocaleString('vi-VN')}
                          </motion.div>
                          <div className="buc-vote-lbl">{t('results.votes') || 'Lượt Vote'}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="gold-divider"></div>

                  {/* DANH SÁCH cho Top 4-10 */}
                  <div className="list-rows">
                    {top.slice(3).map((e, idx) => {
                      const i = idx + 3; // true rank index (3 to 9)
                      const pct = Math.max(8, (e.votes / max) * 100);
                      
                      return (
                        <motion.div 
                          layoutId={`card-${e.id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="list-row" 
                          key={e.id}
                        >
                          <div className="list-rank">{i + 1}</div>
                          
                          <div className="list-thumb">
                            <img src={e.image} alt={e.name} loading="lazy" />
                          </div>
                          
                          <div className="list-info">
                            <div className="list-name">{e.name}</div>
                            <div className="list-bar-wrap">
                              <div className="list-bar" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>

                          <div className="list-votes">
                            <motion.strong
                              key={e.votes}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                            >
                              {e.votes.toLocaleString('vi-VN')}
                            </motion.strong>
                            <small>{t('results.votes') || 'Lượt Vote'}</small>
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
