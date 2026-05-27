import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'framer-motion';
import { db, isConfigured } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function News() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [currentPage, setCurrentPage] = useState(1);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchNews = async () => {
      if (!isConfigured) {
        // Fallback mock newsItems
        const fallbacks = [
          {
            id: 'news-1',
            dateStr: '12 Tháng 5, 2026',
            createdAt: '2026-05-12',
            image: '/images/hero-collage.png',
            title: 'VITA Award 2025 thiết lập kỷ lục mới về lượng người tham gia',
            titleEn: 'VITA Award 2025 sets new records for participation',
            desc: 'Cộng đồng du lịch đã thể hiện sự ủng hộ mạnh mẽ cho các hạng mục giải thưởng mới.',
            descEn: 'The tourism community has shown overwhelming support for the new award categories.'
          },
          {
            id: 'news-2',
            dateStr: '11 Tháng 5, 2026',
            createdAt: '2026-05-11',
            image: '/images/Backround.png',
            title: 'Các influencer địa phương chung tay quảng bá du lịch bền vững',
            titleEn: 'Local influencers promote sustainable tourism',
            desc: 'Chiến dịch mới nhằm làm nổi bật các điểm đến thân thiện với môi trường.',
            descEn: 'A new campaign to highlight eco-friendly destinations.'
          },
          {
            id: 'news-3',
            dateStr: '10 Tháng 5, 2026',
            createdAt: '2026-05-10',
            image: '/images/hero-collage.png',
            title: 'VITA Award 2025 chính thức khởi động — Hành trình tôn vinh ngành du lịch Việt Nam',
            titleEn: 'VITA Award 2025 officially launches — Journey to honor Vietnam tourism',
            desc: 'Lễ khởi động VITA Award 2025 được tổ chức trang trọng với sự góp mặt của hơn 200 đại diện doanh nghiệp lữ hành, điểm đến và nhà sáng tạo nội dung du lịch trên cả nước.',
            descEn: 'The launch ceremony of VITA Award 2025 was solemnly held with the participation of over 200 representatives from travel agencies, destinations, and content creators.'
          },
          {
            id: 'news-4',
            dateStr: '08 Tháng 5, 2026',
            createdAt: '2026-05-08',
            image: '/images/backround ket noi.png',
            title: 'Hội đồng giám khảo công bộ bộ tiêu chí mới cho mùa giải 2026',
            titleEn: 'The jury announces new criteria for the 2026 season',
            desc: 'Bộ tiêu chí đề cao yếu tố du lịch xanh và chuyển đổi số.',
            descEn: 'The criteria emphasize green tourism and digital transformation.'
          },
          {
            id: 'news-5',
            dateStr: '05 Tháng 5, 2026',
            createdAt: '2026-05-05',
            image: '/images/backround phat trien.png',
            title: '120+ đề cử từ 63 tỉnh thành tham gia mùa giải',
            titleEn: '120+ nominations from 63 provinces participate in the season',
            desc: 'Con số kỷ lục cho thấy sức lan tỏa của giải thưởng.',
            descEn: 'A record number showing the spread of the award.'
          },
          {
            id: 'news-6',
            dateStr: '02 Tháng 5, 2026',
            createdAt: '2026-05-02',
            image: '/images/Backround truyen cam hung.png',
            title: 'Talk-show "Du lịch Xanh — Tương lai bền vững" thu hút 5.000 lượt xem',
            titleEn: 'Talk-show "Green Tourism — Sustainable Future" attracts 5,000 views',
            desc: 'Series talkshow đồng hành cùng VITA Award khởi động đầy ấn tượng.',
            descEn: 'The talk-show series accompanying VITA Award started impressively.'
          },
          {
            id: 'news-7',
            dateStr: '28 Tháng 4, 2026',
            createdAt: '2026-04-28',
            image: '/images/Backround.png',
            title: 'Phát động cuộc thi "Khoảnh khắc Việt Nam" trên TikTok & Instagram',
            titleEn: 'Launch of "Vietnam Moments" contest on TikTok & Instagram',
            desc: 'Cộng đồng yêu du lịch chia sẻ ảnh, video về Việt Nam.',
            descEn: 'The travel-loving community shares photos and videos of Vietnam.'
          },
          {
            id: 'news-8',
            dateStr: '25 Tháng 4, 2026',
            createdAt: '2026-04-25',
            image: '/images/hero-collage.png',
            title: 'Phỏng vấn Bộ trưởng Du lịch về VITA Award',
            titleEn: 'Interview with the Minister of Tourism on VITA Award',
            desc: 'Bộ trưởng nhấn mạnh tầm quan trọng của việc vinh danh những người tiên phong về kỹ thuật số.',
            descEn: 'The Minister highlighted the importance of recognizing digital pioneers.'
          },
          {
            id: 'news-9',
            dateStr: '20 Tháng 4, 2026',
            createdAt: '2026-04-20',
            image: '/images/backround ket noi.png',
            title: 'Lễ ký kết tài trợ với các Đối tác Kim Cương',
            titleEn: 'Sponsorship signing ceremony with Diamond Partners',
            desc: 'Các thương hiệu lớn cam kết hỗ trợ sáng kiến du lịch bền vững.',
            descEn: 'Major brands commit to supporting the sustainable tourism initiative.'
          },
          {
            id: 'news-10',
            dateStr: '15 Tháng 4, 2026',
            createdAt: '2026-04-15',
            image: '/images/backround phat trien.png',
            title: 'Hệ thống bình chọn mới được giới thiệu cho năm 2025',
            titleEn: 'New voting system introduced for 2025',
            desc: 'Nền tảng bình chọn minh bạch và bảo mật hơn cho tất cả người dùng.',
            descEn: 'A more transparent and secure voting platform for all users.'
          },
          {
            id: 'news-11',
            dateStr: '10 Tháng 4, 2026',
            createdAt: '2026-04-10',
            image: '/images/Backround truyen cam hung.png',
            title: 'VITA Award ra mắt ứng dụng di động chính thức',
            titleEn: 'VITA Award launches official mobile application',
            desc: 'Theo dõi đề cử và bình chọn trực tiếp từ điện thoại thông minh của bạn.',
            descEn: 'Track nominations and cast votes directly from your smartphone.'
          },
          {
            id: 'news-12',
            dateStr: '05 Tháng 4, 2026',
            createdAt: '2026-04-05',
            image: '/images/Backround.png',
            title: 'Kêu gọi đề cử: Ghi nhận những anh hùng địa phương',
            titleEn: 'Call for nominations: Recognize local heroes',
            desc: 'Hãy giúp chúng tôi tìm ra những viên ngọc ẩn và những cá nhân tạo nên sự khác biệt.',
            descEn: 'Help us find the hidden gems and individuals making a difference.'
          }
        ];
        setNewsItems(fallbacks);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setNewsItems(list);
      } catch (err) {
        console.error("Error fetching news from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [isEn]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--navy)' }}>
        <p style={{ color: '#fff', fontSize: '1.2rem' }}>Đang tải tin tức...</p>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = newsItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            {newsItems.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', padding: '40px' }}>
                {isEn ? 'No news articles available.' : 'Hiện tại chưa có tin tức nào được đăng tải.'}
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
                {paginatedNews.map((item, idx) => (
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
                        {t('news.read_more')} <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
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
