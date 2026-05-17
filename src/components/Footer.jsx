import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-col">
            <div className="logo" style={{ marginBottom: '14px' }}>
              <img src="/images/Logo 1.png" alt="VITA AWARD" style={{ height: '42px' }} />
            </div>
            <p>{t('footer.desc')}</p>
            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '13px' }}>{t('footer.org')}</p>
          </div>
          <div className="foot-col">
            <h5>{t('footer.links')}</h5>
            <Link to="/">{t('nav.info')}</Link>
            <Link to="/vote">{t('nav.vote')}</Link>
            <Link to="/events">{t('nav.events')}</Link>
            <Link to="/results">{t('nav.results')}</Link>
            <Link to="/news">{t('nav.news')}</Link>
          </div>
          <div className="foot-col">
            <h5>{t('footer.support')}</h5>
            <a href="#">{t('footer.faq')}</a>
            <a href="#">{t('footer.rules')}</a>
            <a href="#">{t('footer.guide')}</a>
            <a href="#">{t('footer.contact')}</a>
          </div>
          <div className="foot-col">
            <h5>{t('footer.contact')}</h5>
            <p>📧 contact@vita-award.vn</p>
            <p>📞 1900 1234</p>
            <p>📍 {i18n.language === 'en' ? 'Hanoi — Ho Chi Minh City' : 'Hà Nội — TP. Hồ Chí Minh'}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <a href="#" style={{ fontSize: '20px', margin: 0 }}>📘</a>
              <a href="#" style={{ fontSize: '20px', margin: 0 }}>📷</a>
              <a href="#" style={{ fontSize: '20px', margin: 0 }}>▶️</a>
              <a href="#" style={{ fontSize: '20px', margin: 0 }}>🎵</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">{t('footer.copyright')}</div>
      </div>
    </footer>
  );
}
