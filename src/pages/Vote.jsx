import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

import { VOTE_CATEGORIES } from '../data/categories';
import { AuthContext } from '../App';

export default function Vote() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [currentCat, setCurrentCat] = useState('cat5');
  const [selectedSub, setSelectedSub] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Fake voted items state for nominees
  const [votedIds, setVotedIds] = useState(new Set());
  const { isLoggedIn, setIsModalOpen } = useContext(AuthContext);
  const { addToast } = useToast();

  const activeCategory = VOTE_CATEGORIES.find(c => c.id === currentCat) || VOTE_CATEGORIES[2];

  const handleVoteNominee = (id) => {
    if (!isLoggedIn) {
      addToast(t('auth.toast_login_req'), 'warning');
      setIsModalOpen(true);
      return;
    }
    const newSet = new Set(votedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
      setVotedIds(newSet);
      addToast(t('auth.toast_unvote_success') || 'Đã huỷ bình chọn', 'info');
    } else {
      newSet.add(id);
      setVotedIds(newSet);
      addToast(t('auth.toast_vote_success'), 'success');
    }
  };

  return (
    <PageTransition>
      <section id="vote" style={{ paddingTop: '120px', paddingBottom: '100px', background: 'linear-gradient(180deg,transparent,rgba(14,36,85,.3),transparent)', minHeight: '100vh' }}>
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
                {VOTE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={currentCat === cat.id ? 'active' : ''}
                    onClick={() => {
                      setCurrentCat(cat.id);
                      setSelectedSub(null);
                    }}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {i18n.language === 'en' && cat.labelEn ? cat.labelEn : cat.label}
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
                  {VOTE_CATEGORIES.map(cat => (
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
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{i18n.language === 'en' && activeCategory.titleEn ? activeCategory.titleEn : activeCategory.title}</h3>
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
                  {activeCategory.items.map((item) => (
                    <motion.div 
                      className="vote-category-card" 
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                      }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="vc-card-img">
                        <img src={item.image} alt={item.title} />
                        <div className="vc-card-overlay"></div>
                      </div>
                      <div className="vc-card-content">
                        <div className="vc-card-id">{item.id}</div>
                        <h4 className="vc-card-title">{i18n.language === 'en' && item.titleEn ? item.titleEn : item.title}</h4>
                        <button 
                          className="btn btn-primary vc-btn-vote"
                          onClick={() => setSelectedSub(item)}
                        >
                          ⭐ {t('vote.view_nominees')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
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
                  <h3 className="nominee-title">{i18n.language === 'en' && selectedSub.titleEn ? selectedSub.titleEn : selectedSub.title}</h3>
                </div>

                {/* DANH SÁCH ĐỀ CỬ BÊN TRONG */}
                <div className="vote-category-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                    const nid = `${selectedSub.id}-n${i}`;
                    const isVoted = votedIds.has(nid);
                    return (
                      <motion.div 
                        className="vote-category-card" 
                        key={nid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="vc-card-img">
                          <img src={i % 2 === 0 ? '/images/backround phat trien.png' : '/images/hero-collage.png'} alt="Đề cử mẫu" />
                          <div className="vc-card-overlay"></div>
                        </div>
                        <div className="vc-card-content">
                          <h4 className="vc-card-title" style={{ WebkitLineClamp: 1 }}>{t('vote.nominee')} 0{i}</h4>
                          <p style={{ color: '#ddd', fontSize: '0.9rem', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {t('vote.nominee_desc')} {i18n.language === 'en' && selectedSub.titleEn ? selectedSub.titleEn : selectedSub.title}.
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto', paddingTop: '10px' }}>
                            <div className="vote-count" style={{ color: 'var(--gold-200)', fontSize: '0.9rem' }}>
                              <strong style={{ fontSize: '1.2rem', fontFamily: 'Be Vietnam Pro' }}>{(12000 + i * 500 + (isVoted ? 1 : 0)).toLocaleString('vi-VN')}</strong> {t('vote.votes')}
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
