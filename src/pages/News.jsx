import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';

export default function News() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const newsItems = [
    {
      dateObj: new Date('2026-05-12'),
      dateStr: '12 Tháng 5, 2026',
      image: '/images/hero-collage.png',
      title: isEn ? 'VITA Award 2025 sets new records for participation' : 'VITA Award 2025 thiết lập kỷ lục mới về lượng người tham gia',
      desc: isEn ? 'The tourism community has shown overwhelming support for the new award categories.' : 'Cộng đồng du lịch đã thể hiện sự ủng hộ mạnh mẽ cho các hạng mục giải thưởng mới.'
    },
    {
      dateObj: new Date('2026-05-11'),
      dateStr: '11 Tháng 5, 2026',
      image: '/images/Backround.png',
      title: isEn ? 'Local influencers join hands to promote sustainable tourism' : 'Các influencer địa phương chung tay quảng bá du lịch bền vững',
      desc: isEn ? 'A new campaign to highlight eco-friendly destinations.' : 'Chiến dịch mới nhằm làm nổi bật các điểm đến thân thiện với môi trường.'
    },
    {
      dateObj: new Date('2026-05-10'),
      dateStr: '10 Tháng 5, 2026',
      image: '/images/hero-collage.png',
      title: isEn ? 'VITA Award 2025 officially launches — Journey to honor Vietnam tourism' : 'VITA Award 2025 chính thức khởi động — Hành trình tôn vinh ngành du lịch Việt Nam',
      desc: isEn ? 'The launch ceremony of VITA Award 2025 was solemnly held with the participation of over 200 representatives from travel agencies, destinations, and content creators.' : 'Lễ khởi động VITA Award 2025 được tổ chức trang trọng với sự góp mặt của hơn 200 đại diện doanh nghiệp lữ hành, điểm đến và nhà sáng tạo nội dung du lịch trên cả nước.'
    },
    {
      dateObj: new Date('2026-05-08'),
      dateStr: '08 Tháng 5, 2026',
      image: '/images/backround ket noi.png',
      title: isEn ? 'The jury announces new criteria for the 2026 season' : 'Hội đồng giám khảo công bố bộ tiêu chí mới cho mùa giải 2026',
      desc: isEn ? 'The criteria emphasize green tourism and digital transformation.' : 'Bộ tiêu chí đề cao yếu tố du lịch xanh và chuyển đổi số.'
    },
    {
      dateObj: new Date('2026-05-05'),
      dateStr: '05 Tháng 5, 2026',
      image: '/images/backround phat trien.png',
      title: isEn ? '120+ nominations from 63 provinces participate in the season' : '120+ đề cử từ 63 tỉnh thành tham gia mùa giải',
      desc: isEn ? 'A record number showing the spread of the award.' : 'Con số kỷ lục cho thấy sức lan tỏa của giải thưởng.'
    },
    {
      dateObj: new Date('2026-05-02'),
      dateStr: '02 Tháng 5, 2026',
      image: '/images/Backround truyen cam hung.png',
      title: isEn ? 'Talk-show "Green Tourism — Sustainable Future" attracts 5,000 views' : 'Talk-show "Du lịch Xanh — Tương lai bền vững" thu hút 5.000 lượt xem',
      desc: isEn ? 'The talk-show series accompanying VITA Award started impressively.' : 'Series talkshow đồng hành cùng VITA Award khởi động đầy ấn tượng.'
    },
    {
      dateObj: new Date('2026-04-28'),
      dateStr: '28 Tháng 4, 2026',
      image: '/images/Backround.png',
      title: isEn ? 'Launch of "Vietnam Moments" contest on TikTok & Instagram' : 'Phát động cuộc thi "Khoảnh khắc Việt Nam" trên TikTok & Instagram',
      desc: isEn ? 'The travel-loving community shares photos and videos of Vietnam.' : 'Cộng đồng yêu du lịch chia sẻ ảnh, video về Việt Nam.'
    },
    {
      dateObj: new Date('2026-04-25'),
      dateStr: '25 Tháng 4, 2026',
      image: '/images/hero-collage.png',
      title: isEn ? 'Interview with the Minister of Tourism on VITA Award' : 'Phỏng vấn Bộ trưởng Du lịch về VITA Award',
      desc: isEn ? 'The Minister highlighted the importance of recognizing digital pioneers.' : 'Bộ trưởng nhấn mạnh tầm quan trọng của việc vinh danh những người tiên phong về kỹ thuật số.'
    },
    {
      dateObj: new Date('2026-04-20'),
      dateStr: '20 Tháng 4, 2026',
      image: '/images/backround ket noi.png',
      title: isEn ? 'Sponsorship signing ceremony with Diamond Partners' : 'Lễ ký kết tài trợ với các Đối tác Kim Cương',
      desc: isEn ? 'Major brands commit to supporting the sustainable tourism initiative.' : 'Các thương hiệu lớn cam kết hỗ trợ sáng kiến du lịch bền vững.'
    },
    {
      dateObj: new Date('2026-04-15'),
      dateStr: '15 Tháng 4, 2026',
      image: '/images/backround phat trien.png',
      title: isEn ? 'New voting system introduced for 2025' : 'Hệ thống bình chọn mới được giới thiệu cho năm 2025',
      desc: isEn ? 'A more transparent and secure voting platform for all users.' : 'Nền tảng bình chọn minh bạch và bảo mật hơn cho tất cả người dùng.'
    },
    {
      dateObj: new Date('2026-04-10'),
      dateStr: '10 Tháng 4, 2026',
      image: '/images/Backround truyen cam hung.png',
      title: isEn ? 'VITA Award launches official mobile application' : 'VITA Award ra mắt ứng dụng di động chính thức',
      desc: isEn ? 'Track nominations and cast votes directly from your smartphone.' : 'Theo dõi đề cử và bình chọn trực tiếp từ điện thoại thông minh của bạn.'
    },
    {
      dateObj: new Date('2026-04-05'),
      dateStr: '05 Tháng 4, 2026',
      image: '/images/Backround.png',
      title: isEn ? 'Call for nominations: Recognize local heroes' : 'Kêu gọi đề cử: Ghi nhận những anh hùng địa phương',
      desc: isEn ? 'Help us find the hidden gems and individuals making a difference.' : 'Hãy giúp chúng tôi tìm ra những viên ngọc ẩn và những cá nhân tạo nên sự khác biệt.'
    }
  ];

  // Sắp xếp tin tức mới nhất lên đầu theo dateObj
  const sortedNews = [...newsItems].sort((a, b) => b.dateObj - a.dateObj);

  // Pagination Logic
  const totalPages = Math.ceil(sortedNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = sortedNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <PageTransition>
      <section id="news" style={{ paddingTop: '120px', background: 'linear-gradient(180deg,transparent,rgba(14,36,85,.3),transparent)', minHeight: '100vh', paddingBottom: '100px' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
              <span className="apg-hero-script" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('news.tag') || 'Tin tức'}</span>
              <h2 className="apg-sec-heading">{t('news.title')} <span className="gold-text">{t('news.highlight')}</span></h2>
              <div className="apg-gold-rule" style={{ margin: '20px auto 28px' }}></div>
              <p className="apg-body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('news.desc')}</p>
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
              {paginatedNews.map((item, idx) => (
                <motion.a 
                  href="https://vietnamtravel.net.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
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
                    overflow: 'hidden',
                    textDecoration: 'none'
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
                      {t('news.read_more')} <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                    </span>
                  </div>
                </motion.a>
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
                      window.scrollTo({ top: document.getElementById('news').offsetTop - 100, behavior: 'smooth' });
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
