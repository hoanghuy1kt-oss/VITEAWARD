import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';

export default function Events() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const eventItems = [
    {
      dateObj: new Date('2026-11-20'),
      dateStr: '20 Tháng 11, 2026',
      image: '/images/hero-collage.png',
      title: isEn ? 'VITA Award 2025 Post-Event Exhibition' : 'Triển lãm Hậu sự kiện VITA Award 2025',
      desc: isEn ? 'Explore the journey and the glorious moments of this year\'s award season.' : 'Khám phá hành trình và những khoảnh khắc vinh quang của mùa giải năm nay.'
    },
    {
      dateObj: new Date('2026-11-05'),
      dateStr: '05 Tháng 11, 2026',
      image: '/images/Backround.png',
      title: isEn ? 'Winners Meet & Greet' : 'Giao lưu cùng Người chiến thắng',
      desc: isEn ? 'An exclusive session to hear the success stories directly from the champions.' : 'Buổi giao lưu độc quyền để lắng nghe câu chuyện thành công trực tiếp từ những nhà vô địch.'
    },
    {
      dateObj: new Date('2026-06-15'),
      dateStr: '15 Tháng 6, 2026',
      image: '/images/hero-collage.png',
      title: isEn ? 'Gala Night VITA Award 2025 - Honoring Values' : 'Đêm Gala vinh danh VITA Award 2025 - Tôn vinh giá trị',
      desc: isEn ? 'The grand ceremony to announce and award the winners of VITA Award 2025. Join us for a spectacular night of celebration.' : 'Lễ công bố và trao giải hoành tráng cho những người chiến thắng VITA Award 2025. Hãy tham gia cùng chúng tôi trong một đêm kỷ niệm hoành tráng.'
    },
    {
      dateObj: new Date('2026-10-10'),
      dateStr: '10 Tháng 10, 2026',
      image: '/images/backround ket noi.png',
      title: isEn ? 'VITA Award Roadshow in Da Nang' : 'Roadshow VITA Award tại Đà Nẵng',
      desc: isEn ? 'The second stop of our nationwide roadshow to promote sustainable tourism.' : 'Điểm dừng chân thứ hai của chuỗi roadshow toàn quốc nhằm thúc đẩy du lịch bền vững.'
    },
    {
      dateObj: new Date('2026-09-20'),
      dateStr: '20 Tháng 9, 2026',
      image: '/images/backround phat trien.png',
      title: isEn ? 'Digital Transformation in Tourism Workshop' : 'Hội thảo Chuyển đổi số trong Du lịch',
      desc: isEn ? 'A deep dive into how technology is reshaping the tourism landscape in Vietnam.' : 'Cùng tìm hiểu sâu về cách công nghệ đang định hình lại bối cảnh du lịch tại Việt Nam.'
    },
    {
      dateObj: new Date('2026-09-05'),
      dateStr: '05 Tháng 9, 2026',
      image: '/images/Backround truyen cam hung.png',
      title: isEn ? 'Networking Event for Travel Startups' : 'Sự kiện Giao lưu Khởi nghiệp Du lịch',
      desc: isEn ? 'Connect with investors and industry leaders to grow your travel business.' : 'Kết nối với các nhà đầu tư và những người đứng đầu ngành để phát triển doanh nghiệp du lịch của bạn.'
    },
    {
      dateObj: new Date('2026-08-15'),
      dateStr: '15 Tháng 8, 2026',
      image: '/images/Backround.png',
      title: isEn ? 'Press Conference: Unveiling the Finalists' : 'Họp báo: Công bố các Ứng cử viên lọt vào vòng Chung kết',
      desc: isEn ? 'Join us as we announce the top nominees for the VITA Award 2025.' : 'Hãy tham gia cùng chúng tôi khi công bố những đề cử hàng đầu cho VITA Award 2025.'
    },
    {
      dateObj: new Date('2026-08-01'),
      dateStr: '01 Tháng 8, 2026',
      image: '/images/hero-collage.png',
      title: isEn ? 'Sustainable Tourism Panel Discussion' : 'Tọa đàm về Du lịch Bền vững',
      desc: isEn ? 'Experts discuss the future of eco-friendly travel in Vietnam.' : 'Các chuyên gia thảo luận về tương lai của du lịch thân thiện với môi trường tại Việt Nam.'
    },
    {
      dateObj: new Date('2026-07-20'),
      dateStr: '20 Tháng 7, 2026',
      image: '/images/backround ket noi.png',
      title: isEn ? 'VITA Award Roadshow in Ho Chi Minh City' : 'Roadshow VITA Award tại TP. Hồ Chí Minh',
      desc: isEn ? 'The grand kickoff of our nationwide roadshow series.' : 'Lễ khởi động hoành tráng chuỗi roadshow toàn quốc của chúng tôi.'
    },
    {
      dateObj: new Date('2026-07-05'),
      dateStr: '05 Tháng 7, 2026',
      image: '/images/backround phat trien.png',
      title: isEn ? 'Tech in Travel Innovation Fair' : 'Hội chợ Đổi mới Công nghệ trong Du lịch',
      desc: isEn ? 'Discover cutting-edge solutions for the hospitality sector.' : 'Khám phá các giải pháp tiên tiến cho lĩnh vực nhà hàng khách sạn.'
    },
    {
      dateObj: new Date('2026-06-30'),
      dateStr: '30 Tháng 6, 2026',
      image: '/images/Backround truyen cam hung.png',
      title: isEn ? 'Content Creators Meet & Greet' : 'Gặp gỡ & Giao lưu với các Nhà sáng tạo Nội dung',
      desc: isEn ? 'An exclusive event for top travel vloggers and influencers.' : 'Sự kiện độc quyền dành cho các vlogger và influencer du lịch hàng đầu.'
    },
    {
      dateObj: new Date('2026-06-25'),
      dateStr: '25 Tháng 6, 2026',
      image: '/images/Backround.png',
      title: isEn ? 'Sponsor Appreciation Dinner' : 'Tiệc tối Tri ân Nhà tài trợ',
      desc: isEn ? 'A special evening to thank our generous partners and sponsors.' : 'Một buổi tối đặc biệt để gửi lời cảm ơn đến các đối tác và nhà tài trợ hào phóng của chúng tôi.'
    }
  ];

  // Sắp xếp sự kiện mới nhất lên đầu theo dateObj
  const sortedEvents = [...eventItems].sort((a, b) => b.dateObj - a.dateObj);

  // Pagination Logic
  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <PageTransition>
      <section id="event-updates" style={{ paddingTop: '120px', background: 'linear-gradient(180deg,transparent,rgba(14,36,85,.3),transparent)', minHeight: '100vh', paddingBottom: '100px' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
              <span className="apg-hero-script" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{isEn ? 'Events · Updates' : 'Sự kiện · Cập nhật'}</span>
              <h2 className="apg-sec-heading">{isEn ? 'Upcoming' : 'Sự kiện sắp tới của'} <span className="gold-text">{isEn ? 'Events' : 'VITA Award'}</span></h2>
              <div className="apg-gold-rule" style={{ margin: '20px auto 28px' }}></div>
              <p className="apg-body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{isEn ? 'Stay updated with our latest events, roadshows, and the grand Gala night.' : 'Cập nhật những sự kiện, chuỗi roadshow và đêm Gala vinh danh hoành tráng nhất.'}</p>
            </div>
          </ScrollReveal>
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
                <motion.div 
                  className="news-card" 
                  key={idx}
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
                    overflow: 'hidden'
                  }}
                >
                  <div className="news-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '240px', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="news-body" style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="news-date" style={{ fontSize: '0.85rem', color: 'var(--gold-400)', marginBottom: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>📅 {item.dateStr}</div>
                    <h4 style={{ fontFamily: 'Be Vietnam Pro', fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px', color: '#fff', lineHeight: '1.4' }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                    <span className="news-more" style={{ marginTop: '20px', color: 'var(--gold-200)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {isEn ? 'View Details' : 'Xem chi tiết'} <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

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
