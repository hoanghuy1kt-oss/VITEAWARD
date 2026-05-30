import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

import { VOTE_CATEGORIES } from '../data/categories';
import { AuthContext } from '../App';
import { db, isConfigured } from '../utils/firebase';
import { collection, doc, getDocs, query, where, runTransaction } from 'firebase/firestore';

const parseTitle = (title, isEn) => {
  if (!title) return { line1: '', line2: '', line3: '' };
  let t = title.trim();
  
  if (isEn) {
    if (t.toLowerCase().startsWith('leading')) {
      let rest = t.substring(7).trim();
      if (rest.toLowerCase().endsWith('destinations')) {
        return { line1: 'LEADING', line2: rest.substring(0, rest.length - 12).trim().toUpperCase(), line3: 'DESTINATIONS' };
      }
      return { line1: 'LEADING', line2: rest.toUpperCase(), line3: 'AWARD' };
    }
    return { line1: 'VOTE CATEGORY', line2: t.toUpperCase(), line3: '' };
  }

  // Standardize some specific complex Vietnamese titles first
  if (t.includes('Địa phương có chính sách')) {
    return { line1: 'ĐỊA PHƯƠNG', line2: 'ĐỘT PHÁ SÁNG TẠO', line3: 'HÀNG ĐẦU' };
  }
  if (t.includes('quảng bá du lịch hiệu quả trên TikTok')) {
    return { line1: 'QUẢNG BÁ DU LỊCH', line2: 'HIỆU QUẢ TIKTOK', line3: 'HÀNG ĐẦU' };
  }
  if (t.includes('Cơ sở kinh doanh dịch vụ ăn uống')) {
    return { line1: 'CƠ SỞ ĂN UỐNG', line2: 'DU LỊCH XANH', line3: 'HÀNG ĐẦU' };
  }
  if (t.includes('Cơ sở lưu trú du lịch có nhiều dịch vụ đa dạng')) {
    return { line1: 'CƠ SỞ LƯU TRÚ', line2: 'DỊCH VỤ ĐA DẠNG', line3: 'HÀNG ĐẦU' };
  }
  
  let line1 = '';
  let line2 = '';
  let line3 = '';
  
  // Extract suffix
  if (t.toLowerCase().endsWith('hàng đầu')) {
    line3 = 'HÀNG ĐẦU';
    t = t.substring(0, t.length - 8).trim();
  } else if (t.toLowerCase().endsWith('tốt nhất')) {
    line3 = 'TỐT NHẤT';
    t = t.substring(0, t.length - 8).trim();
  }
  
  // Extract prefix
  const prefixes = [
    { key: 'Điểm đến du lịch', val: 'ĐIỂM ĐẾN' },
    { key: 'Điểm đến', val: 'ĐIỂM ĐẾN' },
    { key: 'Doanh nghiệp du lịch lữ hành', val: 'DOANH NGHIỆP' },
    { key: 'Doanh nghiệp lữ hành', val: 'DOANH NGHIỆP' },
    { key: 'Doanh nghiệp', val: 'DOANH NGHIỆP' },
    { key: 'Cơ sở lưu trú du lịch', val: 'CƠ SỞ LƯU TRÚ' },
    { key: 'Cơ sở lưu trú', val: 'CƠ SỞ LƯU TRÚ' },
    { key: 'Khu nghỉ dưỡng', val: 'KHU NGHỈ DƯỠNG' },
    { key: 'Nhà hàng', val: 'NHÀ HÀNG' },
    { key: 'Du thuyền sang trọng', val: 'DU THUYỀN SANG TRỌNG' },
    { key: 'Du thuyền', val: 'DU THUYỀN' },
    { key: 'Hãng hàng không', val: 'HÃNG HÀNG KHÔNG' },
    { key: 'Công viên chủ đề', val: 'CÔNG VIÊN CHỦ ĐỀ' },
    { key: 'Sân golf', val: 'SÂN GOLF' },
    { key: 'Bãi biển', val: 'BÃI BIỂN' },
    { key: 'Làng Du lịch tốt nhất', val: 'LÀNG DU LỊCH' },
    { key: 'Làng Du lịch', val: 'LÀNG DU LỊCH' },
    { key: 'Làng du lịch', val: 'LÀNG DU LỊCH' },
    { key: 'Sản phẩm du lịch mới nổi', val: 'SẢN PHẨM MỚI NỔI' },
    { key: 'Sản phẩm du lịch', val: 'SẢN PHẨM' }
  ];
  
  for (const item of prefixes) {
    if (t.toLowerCase().startsWith(item.key.toLowerCase())) {
      line1 = item.val;
      t = t.substring(item.key.length).trim();
      break;
    }
  }
  
  // Clean up the middle text (t)
  let mid = t.toUpperCase().replace(/^ĐƯỢC\s+/, '').replace(/^CÓ\s+/, '').replace(/^MANG\s+/, '').trim();
  mid = mid.replace(/–/g, '-');
  
  // Shorten some overly long middle strings to make them look beautiful
  if (mid === 'MỚI NỔI CÓ SỨC HẤP DẪN') mid = 'MỚI NỔI HẤP DẪN';
  if (mid === 'CỘNG ĐỒNG THU HÚT KHÁCH DU LỊCH') mid = 'DU LỊCH CỘNG ĐỒNG';
  if (mid === 'SINH THÁI') mid = 'DU LỊCH SINH THÁI';
  if (mid === 'XANH') mid = 'DU LỊCH XANH';
  if (mid === 'MẠO HIỂM') mid = 'DU LỊCH MẠO HIỂM';
  if (mid === 'HẤP DẪN') mid = 'DU LỊCH HẤP DẪN';
  if (mid === 'THIÊN NHIÊN KỲ VĨ THU HÚT KHÁCH') mid = 'THIÊN NHIÊN KỲ VĨ';
  if (mid === 'DI SẢN - VĂN HÓA THU HÚT KHÁCH') mid = 'DI SẢN - VĂN HÓA';
  if (mid === 'ĐƯỢC THƯƠNG GIA LỰA CHỌN') mid = 'THƯƠNG GIA LỰA CHỌN';
  if (mid === 'ĐƯỢC KHÁCH ĐOÀN LỰA CHỌN') mid = 'KHÁCH ĐOÀN LỰA CHỌN';
  if (mid === 'CÓ NHIỀU DỊCH VỤ ĐA DẠNG VÀ CHẤT LƯỢNG') mid = 'DỊCH VỤ ĐA DẠNG';
  if (mid === 'ĐƯỢC DU KHÁCH YÊU THÍCH') mid = 'ĐƯỢC YÊU THÍCH';
  if (mid === 'ĐƯỢC KHÁCH YÊU THÍCH') mid = 'ĐƯỢC YÊU THÍCH';
  if (mid === 'ĐÓN KHÁCH DU LỊCH') mid = 'ĐÓN KHÁCH';
  if (mid === 'ĐƯỢC GIỚI TRẺ YÊU THÍCH') mid = 'GIỚI TRẺ YÊU THÍCH';
  if (mid === 'ĐƯỢC KHÁCH DU LỊCH LỰA CHỌN NHIỀU QUA PHIM, ẢNH') mid = 'DU LỊCH QUA PHIM ẢNH';
  
  line2 = mid;
  
  // Adjust if line1 is still empty
  if (!line1) {
    line1 = 'HẠNG MỤC';
    line2 = title.toUpperCase();
  }
  
  // If line2 is empty (e.g. "Làng Du lịch tốt nhất"), rearrange
  if (!line2) {
    line2 = line3;
    line3 = '';
  }
  
  return { line1, line2, line3 };
};

export default function Vote() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [categories, setCategories] = useState([]);
  const [currentCat, setCurrentCat] = useState('cat5');
  const [selectedSub, setSelectedSub] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nominees, setNominees] = useState([]);
  const [votedIds, setVotedIds] = useState(new Set()); // Nominee IDs user voted for in this subcategory
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { isLoggedIn, user, setIsModalOpen } = useContext(AuthContext);
  const { addToast } = useToast();

  const activeCategory = categories.find(c => c.id === currentCat) || categories[0];

  // 1. Load Categories & Sub-categories
  useEffect(() => {
    const loadCategoriesData = async () => {
      if (!isConfigured) {
        setCategories(VOTE_CATEGORIES);
        setLoadingCategories(false);
        return;
      }
      try {
        const catSnap = await getDocs(collection(db, 'categories'));
        const subSnap = await getDocs(collection(db, 'subCategories'));
        
        if (catSnap.empty || subSnap.empty) {
          setCategories([]);
        } else {
          const catList = catSnap.docs.map(d => ({ id: d.id, ...d.data(), items: [] }));
          catList.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          
          const subList = subSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          // Map sub-categories to their parent category
          catList.forEach(c => {
            c.items = subList.filter(s => s.categoryId === c.id);
          });
          
          setCategories(catList);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategoriesData();
  }, []);

  // 2. Load Nominees when sub-category changes
  useEffect(() => {
    if (!selectedSub) {
      setNominees([]);
      return;
    }

    const loadNominees = async () => {
      setLoading(true);
      if (!isConfigured) {
        // Fallback mock nominees
        const mockNoms = Array.from({ length: 6 }).map((_, i) => ({
          id: `${selectedSub.id}-n${i + 1}`,
          subCategoryId: selectedSub.id,
          name: `Đề cử mẫu 0${i + 1}`,
          nameEn: `Sample Nominee 0${i + 1}`,
          imageUrl: i % 2 === 0 ? '/images/backround phat trien.png' : '/images/hero-collage.png',
          description: 'Mô tả chi tiết về đề cử mẫu này và lý do đề cử.',
          descriptionEn: 'Detailed description about this sample nominee and reason for nomination.',
          votesCount: 12000 + i * 500
        }));
        setNominees(mockNoms);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'nominees'), where('subCategoryId', '==', selectedSub.id));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a,b) => b.votesCount - a.votesCount);
        setNominees(list);
      } catch (err) {
        console.error("Error loading nominees:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNominees();
  }, [selectedSub]);

  // 3. Load user's active vote in this sub-category
  useEffect(() => {
    if (!isLoggedIn || !user || !selectedSub || !isConfigured) {
      setVotedIds(new Set());
      return;
    }

    const loadUserVotes = async () => {
      try {
        const q = query(
          collection(db, 'votes'), 
          where('userId', '==', user.uid), 
          where('subCategoryId', '==', selectedSub.id)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const votedNomineeIds = new Set(snap.docs.map(d => d.data().nomineeId));
          setVotedIds(votedNomineeIds);
        } else {
          setVotedIds(new Set());
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadUserVotes();
  }, [isLoggedIn, user, selectedSub]);

  // Transaction-based Voting
  const handleVoteNominee = async (nomineeId) => {
    if (!isLoggedIn || !user) {
      addToast(t('auth.toast_login_req') || 'Vui lòng đăng nhập để bình chọn', 'warning');
      setIsModalOpen(true);
      return;
    }

    if (!isConfigured) {
      // Mock mode voting toggle
      const newSet = new Set(votedIds);
      if (newSet.has(nomineeId)) {
        newSet.delete(nomineeId);
        setVotedIds(newSet);
        setNominees(prev => prev.map(n => n.id === nomineeId ? { ...n, votesCount: n.votesCount - 1 } : n));
        addToast(t('auth.toast_unvote_success') || 'Đã huỷ bình chọn', 'info');
      } else {
        newSet.clear(); // Only allow 1 vote per subcategory
        newSet.add(nomineeId);
        setVotedIds(newSet);
        setNominees(prev => prev.map(n => {
          if (n.id === nomineeId) return { ...n, votesCount: n.votesCount + 1 };
          return n;
        }));
        addToast(t('auth.toast_vote_success') || 'Bình chọn thành công!', 'success');
      }
      return;
    }

    try {
      const hasVotedThis = votedIds.has(nomineeId);
      const voteDocId = `${user.uid}_${selectedSub.id}`;
      const voteDocRef = doc(db, 'votes', voteDocId);
      const currentNomineeRef = doc(db, 'nominees', nomineeId);

      await runTransaction(db, async (transaction) => {
        const voteDocSnap = await transaction.get(voteDocRef);

        if (hasVotedThis) {
          // CANCEL VOTE
          transaction.delete(voteDocRef);
          
          const nomSnap = await transaction.get(currentNomineeRef);
          if (nomSnap.exists()) {
            const currentVotes = nomSnap.data().votesCount || 0;
            transaction.update(currentNomineeRef, { votesCount: Math.max(0, currentVotes - 1) });
          }
        } else {
          // SUBMIT VOTE (NEW OR SWAP)
          if (voteDocSnap.exists()) {
            // SWAP VOTE: decrement the old nominee first
            const oldNomineeId = voteDocSnap.data().nomineeId;
            const oldNomineeRef = doc(db, 'nominees', oldNomineeId);
            const oldNomSnap = await transaction.get(oldNomineeRef);
            if (oldNomSnap.exists()) {
              const oldVotes = oldNomSnap.data().votesCount || 0;
              transaction.update(oldNomineeRef, { votesCount: Math.max(0, oldVotes - 1) });
            }
          }

          // Write/Overwrite the vote doc
          transaction.set(voteDocRef, {
            userId: user.uid,
            nomineeId: nomineeId,
            subCategoryId: selectedSub.id,
            createdAt: new Date().toISOString()
          });

          // Increment new nominee
          const newNomSnap = await transaction.get(currentNomineeRef);
          if (newNomSnap.exists()) {
            const newVotes = newNomSnap.data().votesCount || 0;
            transaction.update(currentNomineeRef, { votesCount: newVotes + 1 });
          }
        }
      });

      // Update local state after transaction succeeds
      const newSet = new Set(votedIds);
      if (hasVotedThis) {
        newSet.delete(nomineeId);
        setVotedIds(newSet);
        setNominees(prev => prev.map(n => n.id === nomineeId ? { ...n, votesCount: Math.max(0, n.votesCount - 1) } : n));
        addToast(t('auth.toast_unvote_success') || 'Đã huỷ bình chọn', 'info');
      } else {
        let oldNomId = null;
        if (votedIds.size > 0) {
          oldNomId = Array.from(votedIds)[0];
        }
        newSet.clear();
        newSet.add(nomineeId);
        setVotedIds(newSet);
        
        setNominees(prev => prev.map(n => {
          if (n.id === nomineeId) return { ...n, votesCount: n.votesCount + 1 };
          if (n.id === oldNomId) return { ...n, votesCount: Math.max(0, n.votesCount - 1) };
          return n;
        }));
        addToast(t('auth.toast_vote_success') || 'Bình chọn thành công!', 'success');
      }

    } catch (err) {
      console.error("Voting transaction failed:", err);
      addToast("Bình chọn thất bại. Vui lòng thử lại.", "error");
    }
  };

  if (loadingCategories) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--navy)' }}>
        <p style={{ color: '#fff', fontSize: '1.2rem' }}>Đang tải hạng mục bình chọn...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--navy)', flexDirection: 'column', gap: '20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>Hiện chưa có hạng mục bình chọn nào được cấu hình.</p>
        {isLoggedIn && user && user.role === 'admin' && (
          <a href="/admin" className="btn btn-primary" style={{ borderRadius: '12px' }}>Đi tới trang quản trị để thêm ⚙️</a>
        )}
      </div>
    );
  }

  return (
    <PageTransition>
      <section id="vote" style={{ paddingTop: '120px', paddingBottom: '100px', background: 'linear-gradient(180deg,transparent,rgba(14,36,85,.3),transparent)', minHeight: '100vh' }}>
        <style>{`
          .subcategory-card-premium {
            background: linear-gradient(135deg, rgba(28, 52, 120, 0.7) 0%, rgba(10, 20, 50, 0.9) 100%) !important;
            border: 1.5px solid rgba(212, 175, 55, 0.28) !important;
            border-radius: 20px !important;
            padding: 26px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 180px !important;
            height: 100% !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 12px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08) !important;
            backdrop-filter: blur(14px) !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            aspect-ratio: auto !important;
          }

          /* Shimmer metallic gold sheen effect */
          .subcategory-card-premium::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.25), transparent) !important;
            transform: skewX(-20deg) !important;
            pointer-events: none !important;
            z-index: 3 !important;
          }

          .subcategory-card-premium:hover::after {
            left: 150% !important;
            transition: all 0.95s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }

          .subcategory-card-premium:hover {
            transform: translateY(-6px) !important;
            background: linear-gradient(135deg, rgba(35, 65, 145, 0.8) 0%, rgba(15, 30, 75, 0.98) 100%) !important;
            border-color: rgba(212, 175, 55, 0.75) !important;
            box-shadow: 0 20px 45px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.2) !important;
          }

          .logo-image-premium {
            filter: brightness(2.8) contrast(1.2) drop-shadow(0 0 6px rgba(212, 175, 55, 0.7)) !important;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%) !important;
            padding: 6px !important;
            border-radius: 50% !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            flex-shrink: 0 !important;
          }

          .subcategory-card-premium:hover .logo-image-premium {
            filter: brightness(3.5) contrast(1.3) drop-shadow(0 0 10px rgba(212, 175, 55, 0.98)) !important;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%) !important;
            transform: scale(1.12) !important;
          }

          .subcategory-card-premium .vc-btn-vote {
            background: linear-gradient(135deg, #d4af37 0%, #f3df95 100%) !important;
            border: none !important;
            color: #050d28 !important;
            font-weight: 800 !important;
            letter-spacing: 0.8px !important;
            box-shadow: 0 4px 15px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.3) !important;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
            width: 100% !important;
            padding: 12px 24px !important;
            border-radius: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            cursor: pointer !important;
            text-transform: uppercase !important;
            font-size: 0.85rem !important;
          }

          .subcategory-card-premium:hover .vc-btn-vote {
            background: linear-gradient(135deg, #e5c158 0%, #ffffff 50%, #fff0b8 100%) !important;
            border-color: transparent !important;
            box-shadow: 0 6px 22px rgba(212,175,55,0.55), inset 0 1px 0 rgba(255,255,255,0.4) !important;
            color: #03081b !important;
            transform: scale(1.02) !important;
          }

          .subcategory-title-premium {
            font-size: 1.08rem !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, #ffffff 0%, #fffbeb 50%, #ffe89e 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            margin: 0 !important;
            line-height: 1.5 !important;
            text-align: left !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-transform: uppercase !important;
            letter-spacing: 0.8px !important;
            font-family: "'Be Vietnam Pro', sans-serif" !important;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6)) !important;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          
          .subcategory-card-premium:hover .subcategory-title-premium {
            background: linear-gradient(135deg, #ffffff 0%, #ffeaa3 50%, #ffd700 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.45)) !important;
            transform: translateX(3px) !important;
          }
          }
        `}</style>
        <div className="container">
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="apg-hero-script" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('vote.tag')}</span>
              <h2 className="apg-sec-heading">{t('vote.title')} <span className="gold-text">{t('vote.highlight')}</span></h2>
              <div className="apg-gold-rule" style={{ margin: '20px auto 28px' }}></div>
              <p className="apg-body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('vote.desc')}</p>
            </div>

            {/* TAB SCROLL CHO HẠNG MỤC CHÍNH */}
            <div className="vote-toolbar" style={{ overflowX: 'auto', paddingBottom: '10px', margin: '0 auto 40px auto', maxWidth: 'max-content' }}>
              <div className="vote-tabs" style={{ display: 'flex', gap: '10px', minWidth: 'max-content', padding: '0 10px' }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={currentCat === cat.id ? 'active' : ''}
                    onClick={() => {
                      setCurrentCat(cat.id);
                      setSelectedSub(null);
                    }}
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
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="vote-mobile-options">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`vote-mobile-option ${currentCat === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentCat(cat.id);
                        setSelectedSub(null);
                        setIsDropdownOpen(false);
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

            {!selectedSub ? (
              <>
                {/* TIÊU ĐỀ HẠNG MỤC ĐANG CHỌN */}
                <motion.div 
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: '30px', textAlign: 'center' }}
                >
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{isEn && activeCategory.titleEn ? activeCategory.titleEn : activeCategory.title}</h3>
                </motion.div>
                
                {/* LƯỚI HẠNG MỤC CON */}
                <motion.div 
                  className="vote-category-grid"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08 }
                    }
                  }}
                >
                  {activeCategory.items.map((item) => {
                    const titleText = isEn && item.titleEn ? item.titleEn : item.title;

                    return (
                      <motion.div 
                        className="vote-category-card subcategory-card-premium" 
                        key={item.id}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ y: -5 }}
                      >
                        {/* Soft gold decorative gradient glow on hover */}
                        <div style={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
                          pointerEvents: 'none',
                          zIndex: 1
                        }} />

                        {/* Top Section: Logo + Category Name */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', zIndex: 2 }}>
                          {/* Logo directly rendered & made larger */}
                          <img 
                            src="/images/Logo.png" 
                            alt="VITA Award Logo" 
                            className="logo-image-premium"
                            style={{ 
                              width: '64px', 
                              height: '64px', 
                              objectFit: 'contain',
                              flexShrink: 0
                            }}
                          />

                          {/* Category Name */}
                          <h4 className="subcategory-title-premium">
                            {titleText}
                          </h4>
                        </div>

                        {/* Bottom Section: View Nominees Button */}
                        <div style={{ width: '100%', marginTop: '20px', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-primary vc-btn-vote"
                            onClick={() => setSelectedSub(item)}
                          >
                            ⭐ {t('vote.view_nominees')}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="nominee-view-container"
              >
                <div className="nominee-header">
                  <button 
                    className="btn btn-ghost nominee-back-btn" 
                    onClick={() => setSelectedSub(null)}
                  >
                    ← {t('auth.back_to_cat')}
                  </button>
                  <h3 className="nominee-title">{isEn && selectedSub.titleEn ? selectedSub.titleEn : selectedSub.title}</h3>
                </div>

                {/* DANH SÁCH ĐỀ CỬ BÊN TRONG */}
                <div className="vote-category-grid">
                  {loading ? (
                    <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', gridColumn: '1/-1', padding: '40px' }}>
                      Đang tải danh sách đề cử...
                    </div>
                  ) : nominees.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', gridColumn: '1/-1', padding: '40px' }}>
                      Chưa có đề cử nào trong hạng mục này. Vui lòng thêm đề cử qua trang Admin.
                    </div>
                  ) : nominees.map((nom, i) => {
                    const nid = nom.id;
                    const isVoted = votedIds.has(nid);
                    return (
                      <motion.div 
                        className="vote-category-card" 
                        key={nid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="vc-card-img" style={{ position: 'relative' }}>
                          {nom.url ? (
                            <a href={nom.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                              <img src={nom.imageUrl || '/images/hero-collage.png'} alt={nom.name} />
                            </a>
                          ) : (
                            <img src={nom.imageUrl || '/images/hero-collage.png'} alt={nom.name} />
                          )}
                          <div className="vc-card-overlay"></div>
                        </div>
                        <div className="vc-card-content">
                          <h4 className="vc-card-title" style={{ WebkitLineClamp: 1 }}>
                            {nom.url ? (
                              <a href={nom.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {isEn ? nom.nameEn || nom.name : nom.name}
                                <span style={{ color: 'var(--gold-200)', fontSize: '0.8rem' }}>↗</span>
                              </a>
                            ) : (
                              isEn ? nom.nameEn || nom.name : nom.name
                            )}
                          </h4>
                          <p style={{ color: '#ddd', fontSize: '0.9rem', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {isEn ? nom.descriptionEn || nom.description : nom.description}
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto', paddingTop: '10px' }}>
                            <div className="vote-count" style={{ color: 'var(--gold-200)', fontSize: '0.9rem' }}>
                              <strong style={{ fontSize: '1.2rem', fontFamily: 'Be Vietnam Pro' }}>{(nom.votesCount || 0).toLocaleString('vi-VN')}</strong> {t('vote.votes')}
                            </div>
                            <div className="vote-checklist">
                              <input 
                                type="checkbox" 
                                id={`vote-${nid}`}
                                checked={isVoted}
                                onChange={() => handleVoteNominee(nid)}
                              />
                              <label htmlFor={`vote-${nid}`}>
                                {isVoted ? t('vote.voted') : t('vote.vote_btn')}
                              </label>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
