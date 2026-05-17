import React from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

export default function Sponsors() {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <section id="sponsors" style={{ paddingTop: '120px', paddingBottom: '100px', background: 'linear-gradient(180deg,transparent,rgba(14,36,85,.3),transparent)', minHeight: '100vh' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
              <span className="apg-hero-script" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('sponsors.tag') || 'Đồng hành · Tài trợ'}</span>
              <h2 className="apg-sec-heading">{t('sponsors.title') || 'Nhà'} <span className="gold-text">{t('sponsors.highlight') || 'tài trợ & đối tác'}</span></h2>
              <div className="apg-gold-rule" style={{ margin: '20px auto 28px' }}></div>
              <p className="apg-body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('sponsors.desc') || 'Cảm ơn các đối tác đã đồng hành cùng VITA Award 2025 trong hành trình tôn vinh ngành du lịch Việt Nam.'}</p>
            </div>

            {/* TIER: KIM CƯƠNG */}
            <div className="sponsor-tier" style={{ marginBottom: '60px' }}>
              <h3 className="apg-hero-script" style={{ textAlign: 'center', fontSize: '2rem', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)', marginBottom: '30px' }}>
                {t('sponsors.diamond') || 'Nhà tài trợ Kim Cương'}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
                {[
                  { name: 'Vietnam Airlines', role: 'Diamond Partner' },
                  { name: 'Vingroup Travel', role: 'Diamond Partner' }
                ].map((s, i) => (
                  <div key={i} style={{ 
                    flex: '1 1 320px',
                    maxWidth: '380px',
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    borderRadius: '24px', 
                    padding: '30px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 40px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: '0.3s'
                  }} className="hover-scale">
                    <img src={`https://placehold.co/400x160/rgba(0,0,0,0)/FFF?text=${encodeURIComponent(s.name)}`} alt={s.name} style={{ maxWidth: '100%', height: 'auto', maxHeight: '100px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* TIER: VÀNG */}
            <div className="sponsor-tier" style={{ marginBottom: '60px' }}>
              <h3 className="apg-hero-script" style={{ textAlign: 'center', fontSize: '1.8rem', color: 'var(--gold-300)', textShadow: '0 0 20px rgba(212,175,55,0.3)', marginBottom: '30px' }}>
                {t('sponsors.gold') || 'Nhà tài trợ Vàng'}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                {[
                  { name: 'Saigontourist', role: 'Gold Sponsor' },
                  { name: 'Vietravel', role: 'Gold Sponsor' },
                  { name: 'Sun Group', role: 'Gold Sponsor' },
                  { name: 'Mường Thanh', role: 'Gold Sponsor' }
                ].map((s, i) => (
                  <div key={i} style={{ 
                    flex: '1 1 240px',
                    maxWidth: '280px',
                    background: 'rgba(212, 175, 55, 0.05)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)', 
                    borderRadius: '20px', 
                    padding: '24px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 5px 20px rgba(212,175,55,0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: '0.3s'
                  }} className="hover-scale">
                    <img src={`https://placehold.co/300x140/rgba(0,0,0,0)/d4af37?text=${encodeURIComponent(s.name)}`} alt={s.name} style={{ maxWidth: '100%', height: 'auto', maxHeight: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.3))' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* TIER: BẠC */}
            <div className="sponsor-tier" style={{ marginBottom: '60px' }}>
              <h3 className="apg-hero-script" style={{ textAlign: 'center', fontSize: '1.6rem', color: '#c0c0c0', textShadow: '0 0 15px rgba(192,192,192,0.3)', marginBottom: '30px' }}>
                {t('sponsors.silver') || 'Đối tác Bạc & Truyền thông'}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
                {[
                  { name: 'Vietnam Travel', role: 'Media Partner' },
                  { name: 'VTV24', role: 'Media Partner' },
                  { name: 'VNExpress', role: 'Media Partner' },
                  { name: 'Zing News', role: 'Media Partner' },
                  { name: 'Tuổi Trẻ', role: 'Media Partner' }
                ].map((s, i) => (
                  <div key={i} style={{ 
                    flex: '1 1 200px',
                    maxWidth: '240px',
                    background: 'rgba(192, 192, 192, 0.03)', 
                    border: '1px solid rgba(192, 192, 192, 0.2)', 
                    borderRadius: '16px', 
                    padding: '20px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    transition: '0.3s'
                  }} className="hover-scale">
                    <img src={`https://placehold.co/240x120/rgba(0,0,0,0)/c0c0c0?text=${encodeURIComponent(s.name)}`} alt={s.name} style={{ maxWidth: '100%', height: 'auto', maxHeight: '70px', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', padding: '40px', background: 'rgba(5,13,40,0.5)', border: '1px dashed var(--gold-400)', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
              <h4 style={{ color: 'var(--gold-200)', marginBottom: '12px', fontFamily: 'Playfair Display', fontSize: '1.8rem', fontWeight: '700' }}>{t('sponsors.become_sponsor') || 'Trở thành nhà tài trợ'}</h4>
              <p style={{ color: 'var(--text-soft)', fontSize: '16px', marginBottom: '24px' }}>{t('sponsors.sponsor_desc') || 'Đồng hành cùng hành trình tôn vinh ngành du lịch Việt Nam'}</p>
              <a href="#" className="btn btn-primary" style={{ padding: '14px 36px', borderRadius: '100px', fontSize: '1.1rem' }}>{t('sponsors.contact') || 'Liên hệ đối tác →'}</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <style>{`
        .hover-scale:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>
    </PageTransition>
  );
}
