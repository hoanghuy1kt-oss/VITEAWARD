import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';
import { db, isConfigured } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Events() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [currentPage, setCurrentPage] = useState(1);
  const [eventItems, setEventItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isConfigured) {
        // Fallback mock events
        const fallbacks = [
          {
            id: 'event-1',
            dateStr: '20 Tháng 11, 2026',
            createdAt: '2026-11-20',
            image: '/images/hero-collage.png',
            title: 'Triển lãm Hậu sự kiện VITA Award 2025',
            titleEn: 'VITA Award 2025 Post-Event Exhibition',
            desc: 'Khám phá hành trình và những khoảnh khắc vinh quang của mùa giải năm nay.',
            descEn: 'Explore the journey and the glorious moments of this year\'s award season.'
          },
          {
            id: 'event-2',
            dateStr: '05 Tháng 11, 2026',
            createdAt: '2026-11-05',
            image: '/images/Backround.png',
            title: 'Giao lưu cùng Người chiến thắng',
            titleEn: 'Winners Meet & Greet',
            desc: 'Buổi giao lưu độc quyền để lắng nghe câu chuyện thành công trực tiếp từ những nhà vô địch.',
            descEn: 'An exclusive session to hear the success stories directly from the champions.'
          },
          {
            id: 'event-3',
            dateStr: '15 Tháng 6, 2026',
            createdAt: '2026-06-15',
            image: '/images/hero-collage.png',
            title: 'Đêm Gala vinh danh VITA Award 2025 - Tôn vinh giá trị',
            titleEn: 'Gala Night VITA Award 2025 - Honoring Values',
            desc: 'Lễ công bố và trao giải hoành tráng cho những người chiến thắng VITA Award 2025. Hãy tham gia cùng chúng tôi trong một đêm kỷ niệm hoành tráng.',
            descEn: 'The grand ceremony to announce and award the winners of VITA Award 2025. Join us for a spectacular night of celebration.'
          },
          {
            id: 'event-4',
            dateStr: '10 Tháng 10, 2026',
            createdAt: '2026-10-10',
            image: '/images/backround ket noi.png',
            title: 'Roadshow VITA Award tại Đà Nẵng',
            titleEn: 'VITA Award Roadshow in Da Nang',
            desc: 'Điểm dừng chân thứ hai của chuỗi roadshow toàn quốc nhằm thúc đẩy du lịch bền vững.',
            descEn: 'The second stop of our nationwide roadshow to promote sustainable tourism.'
          },
          {
            id: 'event-5',
            dateStr: '20 Tháng 9, 2026',
            createdAt: '2026-09-20',
            image: '/images/backround phat trien.png',
            title: 'Hội thảo Chuyển đổi số trong Du lịch',
            titleEn: 'Digital Transformation in Tourism Workshop',
            desc: 'Cùng tìm hiểu sâu về cách công nghệ đang định hình lại bối cảnh du lịch tại Việt Nam.',
            descEn: 'A deep dive into how technology is reshaping the tourism landscape in Vietnam.'
          },
          {
            id: 'event-6',
            dateStr: '05 Tháng 9, 2026',
            createdAt: '2026-09-05',
            image: '/images/Backround truyen cam hung.png',
            title: 'Sự kiện Giao lưu Khởi nghiệp Du lịch',
            titleEn: 'Networking Event for Travel Startups',
            desc: 'Kết nối với các nhà đầu tư và những người đứng đầu ngành để phát triển doanh nghiệp du lịch của bạn.',
            descEn: 'Connect with investors and industry leaders to grow your travel business.'
          },
          {
            id: 'event-7',
            dateStr: '15 Tháng 8, 2026',
            createdAt: '2026-08-15',
            image: '/images/Backround.png',
            title: 'Họp báo: Công bố các Ứng cử viên lọt vào vòng Chung kết',
            titleEn: 'Press Conference: Unveiling the Finalists',
            desc: 'Hãy tham gia cùng chúng tôi khi công bố những đề cử hàng đầu cho VITA Award 2025.',
            descEn: 'Join us as we announce the top nominees for the VITA Award 2025.'
          },
          {
            id: 'event-8',
            dateStr: '01 Tháng 8, 2026',
            createdAt: '2026-08-01',
            image: '/images/hero-collage.png',
            title: 'Tọa đàm về Du lịch Bền vững',
            titleEn: 'Sustainable Tourism Panel Discussion',
            desc: 'Các chuyên gia thảo luận về tương lai của du lịch thân thiện với môi trường tại Việt Nam.',
            descEn: 'Experts discuss the future of eco-friendly travel in Vietnam.'
          },
          {
            id: 'event-9',
            dateStr: '20 Tháng 7, 2026',
            createdAt: '2026-07-20',
            image: '/images/backround ket noi.png',
            title: 'Roadshow VITA Award tại TP. Hồ Chí Minh',
            titleEn: 'VITA Award Roadshow in Ho Chi Minh City',
            desc: 'Lễ khởi động hoành tráng chuỗi roadshow toàn quốc của chúng tôi.',
            descEn: 'The grand kickoff of our nationwide roadshow series.'
          },
          {
            id: 'event-10',
            dateStr: '05 Tháng 7, 2026',
            createdAt: '2026-07-05',
            image: '/images/backround phat trien.png',
            title: 'Hội chợ Đổi mới Công nghệ trong Du lịch',
            titleEn: 'Tech in Travel Innovation Fair',
            desc: 'Khám phá các giải pháp tiên tiến cho lĩnh vực nhà hàng khách sạn.',
            descEn: 'Discover cutting-edge solutions for the hospitality sector.'
          },
          {
            id: 'event-11',
            dateStr: '30 Tháng 6, 2026',
            createdAt: '2026-06-30',
            image: '/images/Backround truyen cam hung.png',
            title: 'Gặp gỡ & Giao lưu với các Nhà sáng tạo Nội dung',
            titleEn: 'Content Creators Meet & Greet',
            desc: 'Sự kiện độc quyền dành cho các vlogger và influencer du lịch hàng đầu.',
            descEn: 'An exclusive event for top travel vloggers and influencers.'
          },
          {
            id: 'event-12',
            dateStr: '25 Tháng 6, 2026',
            createdAt: '2026-06-25',
            image: '/images/Backround.png',
            title: 'Tiệc tối Tri ân Nhà tài trợ',
            titleEn: 'Sponsor Appreciation Dinner',
            desc: 'Một buổi tối đặc biệt để gửi lời cảm ơn đến các đối tác và nhà tài trợ hào phóng của chúng tôi.',
            descEn: 'A special evening to thank our generous partners and sponsors.'
          }
        ];
        setEventItems(fallbacks);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setEventItems(list);
      } catch (err) {
        console.error("Error fetching events from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isEn]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--navy)' }}>
        <p style={{ color: '#fff', fontSize: '1.2rem' }}>Đang tải sự kiện truyền thông...</p>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(eventItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = eventItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <PageTransition>
      <section id="event-updates" style={{ paddingTop: '120px', background: 'linear-gradient(180deg,transparent,rgba(14,36,85,.3),transparent)', minHeight: '100vh', paddingBottom: '100px' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
              <span className="apg-hero-script" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{isEn ? 'Media · Updates' : 'Truyền thông · Cập nhật'}</span>
              <h2 className="apg-sec-heading">{isEn ? 'Media' : 'Truyền thông'} <span className="gold-text">VITA Award</span></h2>
              <div className="apg-gold-rule" style={{ margin: '20px auto 28px' }}></div>
              <p className="apg-body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{isEn ? 'Stay updated with our latest media news and publications.' : 'Cập nhật những tin tức truyền thông và ấn phẩm báo chí mới nhất.'}</p>
            </div>
          </ScrollReveal>
            {eventItems.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', padding: '40px' }}>
                {isEn ? 'No event updates available.' : 'Hiện tại chưa có sự kiện truyền thông nào.'}
              </div>
            ) : (
              <motion.div 
                className="news-grid" 
                style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {paginatedEvents.map((item, idx) => (
                  <motion.a 
                    href={item.url || 'https://vietnamtravel.net.vn/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card" 
                    key={item.id || idx}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    style={{
                      background: 'rgba(5, 13, 40, 0.4)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'stretch',
                      overflow: 'hidden',
                      textDecoration: 'none'
                    }}
                  >
                    <div className="news-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '240px', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                      <img src={item.image || '/images/hero-collage.png'} alt={isEn && item.titleEn ? item.titleEn : item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="news-body" style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div className="news-date" style={{ fontSize: '0.85rem', color: 'var(--gold-400)', marginBottom: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>📅 {item.dateStr}</div>
                      <h4 style={{ fontFamily: 'Be Vietnam Pro', fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px', color: '#fff', lineHeight: '1.4' }}>{isEn && item.titleEn ? item.titleEn : item.title}</h4>
                      <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{isEn && item.descEn ? item.descEn : item.desc}</p>
                      <span className="news-more" style={{ marginTop: '20px', color: 'var(--gold-200)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {isEn ? 'View Details' : 'Xem chi tiết'} <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                      </span>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <ScrollReveal delay={0.2}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '60px' }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: document.getElementById('event-updates').offsetTop - 100, behavior: 'smooth' });
                    }}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: currentPage === i + 1 ? '1px solid var(--gold-400)' : '1px solid rgba(212,175,55,0.2)',
                      background: currentPage === i + 1 ? 'var(--gold-300)' : 'rgba(5, 13, 40, 0.4)',
                      color: currentPage === i + 1 ? '#000' : 'var(--gold-200)',
                      fontFamily: 'Be Vietnam Pro',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: currentPage === i + 1 ? '0 0 15px rgba(212,175,55,0.4)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== i + 1) e.target.style.background = 'rgba(212,175,55,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== i + 1) e.target.style.background = 'rgba(5, 13, 40, 0.4)';
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                </div>
              </ScrollReveal>
            )}
        </div>
      </section>
    </PageTransition>
  );
}
