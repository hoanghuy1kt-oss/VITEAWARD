import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

export default function Header({ onOpenModal }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isLoggedIn, setIsLoggedIn, user, setIsChangePasswordOpen } = useContext(AuthContext);
  const { addToast } = useToast();
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
          <img src="/images/Logo 1.png" alt="VITA AWARD" style={{ height: '42px', transform: 'scale(1.5)', transformOrigin: 'left center' }} />
        </Link>
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
        <div className="nav-actions">
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
      </div>
    </nav>
  );
}
