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
  const longNamesVi = [
    'Khu du lịch sinh thái Quốc tế Tuần Châu Hà Nội - Điểm đến hàng đầu Việt Nam',
    'Khách sạn Mường Thanh Luxury Hạ Long Center Quảng Ninh',
    'Hãng hàng không Quốc gia Vietnam Airlines - Trải nghiệm đẳng cấp quốc tế',
    'Tổ hợp Vui chơi Giải trí Sun World Ba Na Hills Đà Nẵng',
    'Hãng xe du lịch vận chuyển hành khách cao cấp Hoàng Long',
  ];
  const longNamesEn = [
    'Tuan Chau Hanoi International Eco-tourism Area - Vietnam Leading Destination',
    'Muong Thanh Luxury Ha Long Center Hotel Quang Ninh Province',
    'Vietnam Airlines - Premium National Carrier Experience',
    'Sun World Ba Na Hills Amusement & Entertainment Complex Danang',
    'Hoang Long Premium Tourist Passenger Transportation Service',
  ];
  return Array.from({ length: 10 }).map((_, i) => {
    let name = isEn 
      ? `Nominee Name ${(i + 1).toString().padStart(2, '0')}`
      : `Tên Đề Cử Số ${(i + 1).toString().padStart(2, '0')}`;
    
    // Inject some long names to test responsiveness
    if (i < 5) {
      name = isEn ? longNamesEn[i] : longNamesVi[i];
    }

    return {
      id: `${subId}-n${i + 1}`,
      name: name,
      desc: subTitle,
      image: images[i % images.length],
      votes: 15000 - i * 1200 + Math.floor(Math.random() * 500) // Tạo số vote ảo có xu hướng giảm dần theo rank
    };
  });
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
  const [isMobileCatDropdownOpen, setIsMobileCatDropdownOpen] = useState(false);
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
          
          /* ── List rows 1–10 ── */
          .list-rows { display: flex; flex-direction: column; gap: 14px; }
          
          .list-row {
            display: flex; align-items: center; gap: 24px;
            background: rgba(8,16,40,0.45);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.03);
            border-radius: 20px; padding: 18px 28px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .list-row:hover {
            transform: translateY(-4px);
            background: rgba(12, 24, 60, 0.6);
            border-color: rgba(212, 175, 55, 0.35);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.05);
          }
          
          .list-row-1 {
            background: linear-gradient(90deg, rgba(255, 185, 0, 0.08) 0%, rgba(8, 16, 40, 0.45) 100%);
            border: 1px solid rgba(255, 185, 0, 0.28);
          }
          .list-row-1:hover {
            border-color: rgba(255, 185, 0, 0.5);
            box-shadow: 0 16px 40px rgba(255, 185, 0, 0.12), 0 0 30px rgba(255, 185, 0, 0.05);
          }
          
          .list-row-2 {
            background: linear-gradient(90deg, rgba(203, 213, 225, 0.08) 0%, rgba(8, 16, 40, 0.45) 100%);
            border: 1px solid rgba(203, 213, 225, 0.22);
          }
          .list-row-2:hover {
            border-color: rgba(203, 213, 225, 0.45);
            box-shadow: 0 16px 40px rgba(203, 213, 225, 0.1), 0 0 30px rgba(203, 213, 225, 0.03);
          }
          
          .list-row-3 {
            background: linear-gradient(90deg, rgba(246, 199, 104, 0.07) 0%, rgba(8, 16, 40, 0.45) 100%);
            border: 1px solid rgba(246, 199, 104, 0.2);
          }
          .list-row-3:hover {
            border-color: rgba(246, 199, 104, 0.4);
            box-shadow: 0 16px 40px rgba(246, 199, 104, 0.08), 0 0 30px rgba(246, 199, 104, 0.03);
          }
          
          .list-rank { width: 56px; height: 56px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; }
          
          .rank-coin {
            width: 46px; height: 46px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 850; font-size: 1.3rem; line-height: 1;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.3);
          }
          
          .coin-gold {
            background: linear-gradient(135deg, #ffe694 0%, #c6931f 50%, #875c00 100%);
            border: 2px solid #ffd700;
            color: #0b1122 !important;
            text-shadow: 0 1px 1px rgba(255,255,255,0.4);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.5), 0 6px 15px rgba(255, 185, 0, 0.35);
          }
          
          .coin-silver {
            background: linear-gradient(135deg, #ffffff 0%, #a6b5c7 50%, #52637a 100%);
            border: 2px solid #cbd5e1;
            color: #0b1122 !important;
            text-shadow: 0 1px 1px rgba(255,255,255,0.4);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.6), 0 6px 15px rgba(203, 213, 225, 0.25);
          }
          
          .coin-bronze {
            background: linear-gradient(135deg, #fcd34d 0%, #b4783a 50%, #61370b 100%);
            border: 2px solid #f6c768;
            color: #0b1122 !important;
            text-shadow: 0 1px 1px rgba(255,255,255,0.3);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 6px 15px rgba(246, 199, 104, 0.2);
          }
          
          .coin-standard {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.8) !important;
            width: 40px; height: 40px; font-size: 1.1rem;
            box-shadow: none;
          }
          
          .list-thumb { 
            width: 120px; height: 80px; border-radius: 14px; overflow: hidden; flex-shrink: 0; 
            border: 2px solid rgba(255,255,255,.06); 
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
          }
          .list-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
          .list-row:hover .list-thumb { border-color: rgba(212, 175, 55, 0.4); transform: scale(1.03); }
          .list-row:hover .list-thumb img { transform: scale(1.08); }
          
          .list-info { flex: 1; min-width: 0; }
          .list-name { font-weight: 700; font-size: 1.2rem; color: #fff; line-height: 1.4; letter-spacing: 0.3px; }
          .list-bar-wrap { margin-top: 10px; height: 6px; background: rgba(0,0,0,.45); border-radius: 999px; overflow: hidden; border: 1px solid rgba(255,255,255,0.03); }
          .list-bar { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--gold-400), var(--gold-200), #fff); box-shadow: 0 0 8px rgba(212,175,55,0.4); transition: width 1.2s cubic-bezier(.4,0,.2,1); }
          
          .list-votes { text-align: right; flex-shrink: 0; }
          .list-votes strong { font-size: 1.45rem; font-weight: 800; color: #fff; display: block; letter-spacing: 0.5px; }
          .list-votes small { font-size: .75rem; color: rgba(255,255,255,.45); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; display: block; }
          
          @keyframes floatCrown {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-3px); }
          }
          
          .results-sponsors-strip {
            background: rgba(255, 255, 255, 0.015);
            border: 1px dashed rgba(212, 175, 55, 0.22) !important;
            border-radius: 24px;
            backdrop-filter: blur(12px);
            box-shadow: inset 0 0 30px rgba(212, 175, 55, 0.02);
            transition: all 0.4s ease;
          }
          .results-sponsors-strip:hover {
            border-color: rgba(212, 175, 55, 0.4) !important;
            background: rgba(255, 255, 255, 0.03);
            box-shadow: inset 0 0 40px rgba(212, 175, 55, 0.04), 0 12px 48px rgba(0, 0, 0, 0.45);
          }
          
          .sponsor-logo-item {
            opacity: 0.55;
            filter: grayscale(1) brightness(1.6);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .sponsor-logo-item:hover {
            opacity: 0.95;
            filter: grayscale(0) brightness(1);
            transform: scale(1.05);
          }

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
          
          @media (max-width: 640px) {
            .custom-select-btn::before, .custom-select-btn::after {
              display: none !important;
            }
            .custom-select-wrapper {
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .live-tag {
              position: static;
              transform: none;
              margin: 8px auto 0;
            }
            .list-row {
              padding: 14px 16px;
              gap: 6px 12px;
              border-radius: 16px;
              display: grid;
              grid-template-columns: auto auto 1fr;
              grid-template-rows: auto auto;
              align-items: center;
            }
            .list-rank {
              width: 42px;
              height: 42px;
              grid-row: 1 / span 2;
            }
            .rank-coin {
              width: 34px;
              height: 34px;
              font-size: 1.1rem;
            }
            .coin-standard {
              width: 30px;
              height: 30px;
              font-size: 0.9rem;
            }
            .list-thumb {
              width: 75px;
              height: 50px;
              border-radius: 8px;
              grid-row: 1 / span 2;
            }
            .list-info {
              grid-row: 1;
              grid-column: 3;
              align-self: end;
            }
            .list-name {
              font-size: 0.92rem;
              word-break: break-word;
              overflow-wrap: anywhere;
            }
            .list-votes {
              grid-row: 2;
              grid-column: 3;
              text-align: left;
              display: flex;
              align-items: baseline;
              gap: 6px;
              align-self: start;
            }
            .list-votes strong {
              font-size: 1.05rem;
              display: inline-block;
            }
            .list-votes small {
              font-size: 0.65rem;
              letter-spacing: 1px;
              display: inline-block;
              margin-top: 0;
            }
            .lb-title {
              font-size: 1.6rem !important;
              line-height: 1.4;
            }
            .lb-subtitle {
              padding: 8px 20px;
              font-size: 0.85rem;
            }
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

            {/* Mobile Category Dropdown Selector */}
            <div className="vote-mobile-selector">
              <button 
                className="vote-mobile-trigger" 
                onClick={() => setIsMobileCatDropdownOpen(!isMobileCatDropdownOpen)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-300)' }}>
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                    <path d="M12 2a4 4 0 0 0-4 4v6h8V6a4 4 0 0 0-4-4z" />
                  </svg>
                  {isEn ? 'Category:' : 'Hạng mục:'} <strong>{isEn && activeCategory.labelEn ? activeCategory.labelEn : activeCategory.label}</strong>
                </span>
                <span className={`chevron ${isMobileCatDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {isMobileCatDropdownOpen && (
                <div className="vote-mobile-options">
                  {VOTE_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`vote-mobile-option ${currentCat === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentCat(cat.id);
                        setIsMobileCatDropdownOpen(false);
                      }}
                    >
                      <span className="option-dot" />
                      <span className="option-label">{isEn && cat.labelEn ? cat.labelEn : cat.label}</span>
                      {currentCat === cat.id && <span className="option-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
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
                  
                  {/* DANH SÁCH Top 10 */}
                  <div className="list-rows">
                    {top.map((e, i) => {
                      const pct = Math.max(8, (e.votes / max) * 100);
                      
                      // Row and coin color distinctions
                      let rowStyleClass = '';
                      let coinStyleClass = 'coin-standard';
                      let barGradient = 'linear-gradient(90deg, var(--gold-400), var(--gold-200), #fff)';
                      let barGlow = '0 0 8px rgba(212,175,55,0.4)';
                      
                      if (i === 0) {
                        rowStyleClass = 'list-row-1';
                        coinStyleClass = 'coin-gold';
                        barGradient = 'linear-gradient(90deg, #ffb900, #ff8800, #fff)';
                        barGlow = '0 0 12px rgba(255,185,0,0.5)';
                      } else if (i === 1) {
                        rowStyleClass = 'list-row-2';
                        coinStyleClass = 'coin-silver';
                        barGradient = 'linear-gradient(90deg, #94a3b8, #cbd5e1, #fff)';
                        barGlow = '0 0 12px rgba(203,213,225,0.4)';
                      } else if (i === 2) {
                        rowStyleClass = 'list-row-3';
                        coinStyleClass = 'coin-bronze';
                        barGradient = 'linear-gradient(90deg, #b4783a, #f6c768, #fff)';
                        barGlow = '0 0 12px rgba(246,199,104,0.4)';
                      }

                      return (
                        <motion.div 
                          layoutId={`card-${e.id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className={`list-row ${rowStyleClass}`}
                          key={e.id}
                        >
                          <div className="list-rank">
                            {i === 0 && (
                              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.25rem', filter: 'drop-shadow(0 2px 4px rgba(255,185,0,0.5))', animation: 'floatCrown 2.5s ease-in-out infinite' }}>
                                👑
                              </div>
                            )}
                            <div className={`rank-coin ${coinStyleClass}`}>
                              {i + 1}
                            </div>
                          </div>
                          
                          <div className="list-thumb">
                            <img src={e.image} alt={e.name} loading="lazy" />
                          </div>
                          
                          <div className="list-info">
                            <div className="list-name" style={{ color: i === 0 ? 'var(--gold-200)' : i === 1 ? '#cbd5e1' : i === 2 ? '#f6c768' : '#fff' }}>
                              {e.name}
                            </div>
                            <div className="list-bar-wrap">
                              <div className="list-bar" style={{ 
                                width: `${pct}%`,
                                background: barGradient,
                                boxShadow: barGlow
                              }}></div>
                            </div>
                          </div>

                          <div className="list-votes">
                            <motion.strong
                              key={e.votes}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              style={{ color: i === 0 ? 'var(--gold-200)' : i === 1 ? '#cbd5e1' : i === 2 ? '#f6c768' : '#fff' }}
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
