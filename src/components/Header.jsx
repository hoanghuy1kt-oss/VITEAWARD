import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

export default function Header({ onOpenModal }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { isLoggedIn, setIsLoggedIn, user, setIsChangePasswordOpen } = useContext(AuthContext);
  const { addToast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { path: '/about', label: t('nav.info') },
    { path: '/vote', label: t('nav.vote') },
    { path: '/results', label: t('nav.results') },
    { path: '/news', label: t('nav.news') },
    { path: '/events', label: t('nav.events') },
    { path: '/sponsors', label: t('nav.sponsors') },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <img src="/images/Logo 1.png" alt="VITA AWARD" className="nav-logo-img" />
        </Link>
        
        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="nav-actions-desktop">
          <div className="lang-switch" style={{ display: 'flex', gap: '8px', marginRight: '16px', alignItems: 'center' }}>
            <button
              onClick={() => changeLanguage('vi')}
              style={{ background: 'none', border: 'none', color: i18n.language === 'vi' ? 'var(--gold-300)' : '#fff', cursor: 'pointer', fontWeight: i18n.language === 'vi' ? 'bold' : 'normal', padding: 0 }}
            >VI</button>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <button
              onClick={() => changeLanguage('en')}
              style={{ background: 'none', border: 'none', color: i18n.language === 'en' ? 'var(--gold-300)' : '#fff', cursor: 'pointer', fontWeight: i18n.language === 'en' ? 'bold' : 'normal', padding: 0 }}
            >EN</button>
          </div>
          {isLoggedIn ? (
            <div className="user-profile-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
              <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(212,175,55,0.3)', transition: '0.3s' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</span>
                <span style={{ color: 'var(--gold-200)', fontSize: '0.7rem', marginLeft: '4px' }}>▼</span>
              </div>
              
              {isDropdownOpen && (
                <div className="user-dropdown" style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: '0',
                  background: 'rgba(5, 13, 40, 0.95)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  padding: '8px 0',
                  minWidth: '180px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 100
                }}>
                  <div style={{ padding: '10px 16px', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.target.style.background = 'rgba(212,175,55,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'} onClick={() => { setIsChangePasswordOpen(true); setIsDropdownOpen(false); }}>
                    <span>🔒</span> {t('auth.change_pass')}
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                  <div style={{ padding: '10px 16px', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.9rem', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,77,79,0.1)'} onMouseLeave={(e) => e.target.style.background = 'transparent'} onClick={() => { setIsLoggedIn(false); setIsDropdownOpen(false); addToast(t('auth.toast_logout'), 'info'); }}>
                    <span>🚪</span> {t('auth.logout')}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-ghost" onClick={onOpenModal}>{t('nav.login') || 'Đăng nhập'}</button>
          )}
          <Link to="/vote" className="btn btn-primary">{t('nav.vote_now') || 'Bình chọn ngay'}</Link>
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          className={`hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile navigation drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-nav-actions">
          {isLoggedIn ? (
            <div className="mobile-user-box">
              <div style={{ color: 'var(--gold-200)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-200)' }}>
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {user.name}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '100%' }}>
                <button 
                  className="btn btn-ghost" 
                  style={{ width: '100%', fontSize: '0.9rem', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => { setIsChangePasswordOpen(true); setIsMobileMenuOpen(false); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {t('auth.change_pass')}
                </button>
                <button 
                  className="btn" 
                  style={{ width: '100%', fontSize: '0.9rem', padding: '10px', color: '#ff4d4f', borderColor: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => { setIsLoggedIn(false); setIsMobileMenuOpen(false); addToast(t('auth.toast_logout'), 'info'); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  {t('auth.logout')}
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="btn btn-ghost" 
              style={{ width: '100%', fontSize: '1rem', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => { onOpenModal(); setIsMobileMenuOpen(false); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
              {t('nav.login') || 'Đăng nhập'}
            </button>
          )}
          
          <div className="mobile-lang-switch">
            <span style={{ color: 'var(--text-soft)' }}>{isEn ? 'Language:' : 'Ngôn ngữ:'}</span>
            <button
              onClick={() => changeLanguage('vi')}
              className={i18n.language === 'vi' ? 'active' : ''}
            >VI</button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <button
              onClick={() => changeLanguage('en')}
              className={i18n.language === 'en' ? 'active' : ''}
            >EN</button>
          </div>

          <Link to="/vote" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', padding: '12px' }}>
            ⭐ {t('nav.vote_now') || 'Bình chọn ngay'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
