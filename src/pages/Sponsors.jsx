import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { db, isConfigured } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Sponsors() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      if (!isConfigured) {
        // Fallback mock sponsors
        const fallbacks = [
          { id: 'spon-1', name: 'Vietnam Airlines', nameEn: 'Vietnam Airlines', image: '', tier: 'diamond', sortOrder: 1 },
          { id: 'spon-2', name: 'Vingroup Travel', nameEn: 'Vingroup Travel', image: '', tier: 'diamond', sortOrder: 2 },
          { id: 'spon-3', name: 'Saigontourist', nameEn: 'Saigontourist', image: '', tier: 'gold', sortOrder: 3 },
          { id: 'spon-4', name: 'Vietravel', nameEn: 'Vietravel', image: '', tier: 'gold', sortOrder: 4 },
          { id: 'spon-5', name: 'Sun Group', nameEn: 'Sun Group', image: '', tier: 'gold', sortOrder: 5 },
          { id: 'spon-6', name: 'Mường Thanh', nameEn: 'Muong Thanh', image: '', tier: 'gold', sortOrder: 6 },
          { id: 'spon-7', name: 'Vietnam Travel', nameEn: 'Vietnam Travel', image: '', tier: 'silver_media', sortOrder: 7 },
          { id: 'spon-8', name: 'VTV24', nameEn: 'VTV24', image: '', tier: 'silver_media', sortOrder: 8 },
          { id: 'spon-9', name: 'VNExpress', nameEn: 'VNExpress', image: '', tier: 'silver_media', sortOrder: 9 },
          { id: 'spon-10', name: 'Zing News', nameEn: 'Zing News', image: '', tier: 'silver_media', sortOrder: 10 },
          { id: 'spon-11', name: 'Tuổi Trẻ', nameEn: 'Tuoi Tre', image: '', tier: 'silver_media', sortOrder: 11 }
        ];
        setSponsors(fallbacks);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'sponsors'));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setSponsors(list);
      } catch (err) {
        console.error("Error fetching sponsors from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const getSponsorLogo = (s, displayName, colorHex = 'FFF') => {
    return s.image || `https://placehold.co/400x160/rgba(0,0,0,0)/${colorHex}?text=${encodeURIComponent(displayName)}`;
  };

  const diamondSponsors = sponsors.filter(s => s.tier === 'diamond');
  const goldSponsors = sponsors.filter(s => s.tier === 'gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'silver_media');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--navy)' }}>
        <p style={{ color: '#fff', fontSize: '1.2rem' }}>Đang tải danh sách nhà tài trợ...</p>
      </div>
    );
  }

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

            {sponsors.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', padding: '40px' }}>
                {isEn ? 'No sponsors or partners listed.' : 'Chưa có thông tin đối tác tài trợ.'}
              </div>
            )}

            {/* TIER: KIM CƯƠNG */}
            {diamondSponsors.length > 0 && (
              <div className="sponsor-tier" style={{ marginBottom: '60px' }}>
                <h3 className="apg-hero-script" style={{ textAlign: 'center', fontSize: '2rem', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)', marginBottom: '30px' }}>
                  {t('sponsors.diamond') || 'Nhà tài trợ Kim Cương'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
                  {diamondSponsors.map((s) => {
                    const dispName = isEn && s.nameEn ? s.nameEn : s.name;
                    const CardElement = s.url ? 'a' : 'div';
                    const elementProps = s.url ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' } : {};
                    return (
                      <CardElement key={s.id} {...elementProps} style={{ 
                        flex: '1 1 380px',
                        maxWidth: '450px',
                        padding: '20px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '0.3s',
                        cursor: s.url ? 'pointer' : 'default',
                        textDecoration: 'none'
                      }} className="hover-scale">
                        <img src={getSponsorLogo(s, dispName, 'FFF')} alt={dispName} style={{ maxWidth: '100%', height: 'auto', maxHeight: '180px', objectFit: 'contain' }} />
                      </CardElement>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIER: VÀNG */}
            {goldSponsors.length > 0 && (
              <div className="sponsor-tier" style={{ marginBottom: '60px' }}>
                <h3 className="apg-hero-script" style={{ textAlign: 'center', fontSize: '1.8rem', color: 'var(--gold-300)', textShadow: '0 0 20px rgba(212,175,55,0.3)', marginBottom: '30px' }}>
                  {t('sponsors.gold') || 'Nhà tài trợ Vàng'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                  {goldSponsors.map((s) => {
                    const dispName = isEn && s.nameEn ? s.nameEn : s.name;
                    const CardElement = s.url ? 'a' : 'div';
                    const elementProps = s.url ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' } : {};
                    return (
                      <CardElement key={s.id} {...elementProps} style={{ 
                        flex: '1 1 300px',
                        maxWidth: '350px',
                        padding: '16px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '0.3s',
                        cursor: s.url ? 'pointer' : 'default',
                        textDecoration: 'none'
                      }} className="hover-scale">
                        <img src={getSponsorLogo(s, dispName, 'd4af37')} alt={dispName} style={{ maxWidth: '100%', height: 'auto', maxHeight: '140px', objectFit: 'contain' }} />
                      </CardElement>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIER: BẠC */}
            {silverSponsors.length > 0 && (
              <div className="sponsor-tier" style={{ marginBottom: '60px' }}>
                <h3 className="apg-hero-script" style={{ textAlign: 'center', fontSize: '1.6rem', color: '#c0c0c0', textShadow: '0 0 15px rgba(192,192,192,0.3)', marginBottom: '30px' }}>
                  {t('sponsors.silver') || 'Đối tác Bạc & Truyền thông'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
                  {silverSponsors.map((s) => {
                    const dispName = isEn && s.nameEn ? s.nameEn : s.name;
                    const CardElement = s.url ? 'a' : 'div';
                    const elementProps = s.url ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' } : {};
                    return (
                      <CardElement key={s.id} {...elementProps} style={{ 
                        flex: '1 1 240px',
                        maxWidth: '280px',
                        padding: '12px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '0.3s',
                        cursor: s.url ? 'pointer' : 'default',
                        textDecoration: 'none'
                      }} className="hover-scale">
                        <img src={getSponsorLogo(s, dispName, 'c0c0c0')} alt={dispName} style={{ maxWidth: '100%', height: 'auto', maxHeight: '110px', objectFit: 'contain' }} />
                      </CardElement>
                    );
                  })}
                </div>
              </div>
            )}

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
