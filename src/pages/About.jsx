import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import MagneticElement from '../components/MagneticElement';
import InteractiveBackground from '../components/InteractiveBackground';

const GOALS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v6h8V6a4 4 0 0 0-4-4z" />
      </svg>
    ),
    bold: 'Tạo động lực', boldEn: 'Create motivation',
    text: 'cạnh tranh lành mạnh, nâng cao chất lượng dịch vụ và thương hiệu du lịch Việt Nam.',
    textEn: 'for healthy competition, enhancing service quality and the Vietnam tourism brand.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    bold: 'Khuyến khích', boldEn: 'Encourage',
    text: 'chuyển đổi số, du lịch xanh và phát triển bền vững.',
    textEn: 'digital transformation, green tourism, and sustainable development.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      </svg>
    ),
    bold: 'Xây dựng', boldEn: 'Build',
    text: 'mạng lưới kết nối giữa doanh nghiệp, địa phương và đối tác chiến lược để quảng bá hình ảnh du lịch Việt Nam ra quốc tế.',
    textEn: 'a connection network between enterprises, localities, and strategic partners to promote the image of Vietnam tourism internationally.'
  },
];

const MISSION_ITEMS = [
  { icon: '🏆', text: 'Tôn vinh những giá trị nổi bật của ngành du lịch Việt Nam', textEn: 'Honor the outstanding values of the Vietnam tourism industry' },
  { icon: '🌱', text: 'Thúc đẩy chuyển đổi số & du lịch xanh', textEn: 'Promote digital transformation & green tourism' },
  { icon: '❤️', text: 'Lan tỏa cảm hứng khám phá Việt Nam', textEn: 'Spread the inspiration to explore Vietnam' },
  { icon: '👥', text: 'Kết nối doanh nghiệp, điểm đến và cộng đồng du lịch', textEn: 'Connect businesses, destinations, and the tourism community' },
];

const PILLARS = [
  { icon: '🏆', name: 'Tôn vinh', nameEn: 'Honor', sub: 'Giá trị thực', subEn: 'True Values' },
  { icon: '💡', name: 'Lan tỏa', nameEn: 'Spread', sub: 'Cảm hứng', subEn: 'Inspiration' },
  { icon: '👥', name: 'Kết nối', nameEn: 'Connect', sub: 'Cộng đồng', subEn: 'Community' },
  { icon: '🧭', name: 'Hướng tới', nameEn: 'Look Towards', sub: 'Tương lai', subEn: 'The Future' },
];

const BRAND_VALUES = [
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Bản sắc Việt Nam', titleEn: 'Vietnam Identity',
    desc: 'Tôn vinh văn hóa, con người và điểm đến Việt Nam.', descEn: 'Honoring the culture, people and destinations of Vietnam.',
    hasBadge: true,
    color: '#fbbf24', // Amber
    glowColor: 'rgba(245, 158, 11, 0.12)',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c0 2-.52 3.5-3 9.2a7 7 0 0 1-5 8.8zm0 0v-4" />
      </svg>
    ),
    title: 'Phát triển bền vững', titleEn: 'Sustainable Development',
    desc: 'Hướng tới tương lai xanh cho ngành du lịch.', descEn: 'Moving towards a green future for the tourism industry.',
    color: '#34d399', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.12)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.886L4.2 9l5.888 1.914L12 16.8l1.912-5.886L19.8 9l-5.888-1.914ZM5 3l.8.8L5 4.6l-.8-.8ZM19 15l.8.8-.8.8-.8-.8ZM18 4l1 1-1 1-1-1ZM6 16l1 1-1 1-1-1Z" />
      </svg>
    ),
    title: 'Truyền cảm hứng', titleEn: 'Inspiring',
    desc: 'Lan tỏa những câu chuyện tích cực & giá trị thật.', descEn: 'Spreading positive stories and true values.',
    color: '#818cf8', // Indigo
    glowColor: 'rgba(99, 102, 241, 0.12)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Kết nối cộng đồng', titleEn: 'Community Connection',
    desc: 'Gắn kết doanh nghiệp, địa phương và cộng đồng du lịch.', descEn: 'Connecting businesses, localities, and the tourism community.',
    color: '#fb7185', // Rose
    glowColor: 'rgba(244, 63, 94, 0.12)',
  },
];
const CATEGORIES = [
  {
    n: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    name: 'Địa phương có chính sách đột phá, sáng tạo phát triển du lịch hàng đầu',
    nameEn: 'Leading localities with breakthrough and creative policies for tourism development'
  },
  {
    n: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M12 3C12 3 9 8 9 13C9 17 11 20 12 21C13 20 15 17 15 13C15 8 12 3 12 3Z" />
        <path d="M12 10C9 10 6 13 6 17C6 19 8 20.5 9 21M12 10C15 10 18 13 18 17C18 19 16 20.5 15 21" />
      </svg>
    ),
    name: 'Làng Du lịch tốt nhất',
    nameEn: 'Best Tourism Villages'
  },
  {
    n: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    name: 'Điểm đến - Công viên Du lịch hàng đầu',
    nameEn: 'Leading Destinations - Tourism Parks'
  },
  {
    n: '04',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="m12 3-1.912 5.886L4.2 9l5.888 1.914L12 16.8l1.912-5.886L19.8 9l-5.888-1.914Z" />
      </svg>
    ),
    name: 'Sản phẩm du lịch mới nổi hàng đầu',
    nameEn: 'Leading emerging tourism products'
  },
  {
    n: '05',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
    name: 'Doanh nghiệp lữ hành hàng đầu',
    nameEn: 'Leading Tour Operators'
  },
  {
    n: '06',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="15" y1="22" x2="15" y2="16" />
        <line x1="9" y1="16" x2="15" y2="16" />
        <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" />
      </svg>
    ),
    name: 'Cơ sở lưu trú, nhà hàng du lịch hàng đầu',
    nameEn: 'Leading Accommodations and Restaurants'
  },
  {
    n: '07',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" />
        <path d="M12 2v16M12 2l7 5H12" />
      </svg>
    ),
    name: 'Đơn vị vận chuyển du lịch được yêu thích hàng đầu',
    nameEn: 'Leading Tourist Transport Providers'
  },
  {
    n: '08',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    name: 'Giải Chuyên đề TikTok (Quảng bá du lịch hiệu quả)',
    nameEn: 'TikTok Special Awards (Effective tourism promotion)'
  },
];
const JOURNEY_STAGES = [
  {
    date: '20.04 - 10.05.2026',
    title: '1. KHỞI ĐỘNG', titleEn: '1. KICK-OFF',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    desc: [
      'Xây dựng kế hoạch tổng thể',
      'Thành lập Ban tổ chức & các Tiểu ban',
      'Hoàn thiện bộ nhận diện VITA AWARD 2026',
      'Công bố khởi động giải thưởng'
    ],
    descEn: [
      'Develop a master plan',
      'Establish the Organizing Committee & Sub-committees',
      'Finalize the VITA AWARD 2026 brand identity',
      'Announce the launch of the award'
    ]
  },
  {
    date: '11.05 - 15.06.2026',
    title: '2. TRUYỀN THÔNG & MỞ ĐỀ CỬ', titleEn: '2. COMMUNICATION & NOMINATIONS OPEN',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
    desc: [
      'Chiến dịch truyền thông đa kênh',
      'Mở cổng đề cử/đăng ký tham gia',
      'Kết nối Hội đồng chuyên môn & đối tác'
    ],
    descEn: [
      'Multi-channel communication campaign',
      'Open the portal for nominations/registration',
      'Connect with the Expert Council & partners'
    ]
  },
  {
    date: '11.05 - 15.06.2026',
    title: '3. TIẾP NHẬN & THẨM ĐỊNH HỒ SƠ', titleEn: '3. RECEIVE & EVALUATE APPLICATIONS',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
    desc: [
      'Tiếp nhận hồ sơ đề cử',
      'Thẩm định sơ loại',
      'Đánh giá & chấm điểm bởi Hội đồng chuyên môn',
      'Lựa chọn đề cử vào vòng chung khảo'
    ],
    descEn: [
      'Receive nomination applications',
      'Preliminary evaluation',
      'Evaluation & scoring by the Expert Council',
      'Select nominees for the final round'
    ]
  },
  {
    date: '25.05 - 25.06.2026',
    title: '4. CHUNG KHẢO', titleEn: '4. FINAL ROUND',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <circle cx="12" cy="8" r="7" />
        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
      </svg>
    ),
    desc: [
      'Thẩm định thực tế (nếu có)',
      'Bình chọn Hội đồng & bình chọn cộng đồng',
      'Hoàn thiện danh sách đề cử xuất sắc'
    ],
    descEn: [
      'Field evaluation (if any)',
      'Council voting & community voting',
      'Finalize the list of outstanding nominees'
    ]
  },
  {
    date: '25.06 - 09.07.2026',
    title: '5. GIỚI THIỆU ĐỀ CỬ & BÌNH CHỌN', titleEn: '5. INTRODUCE NOMINEES & VOTING',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 11l2 2 4-4" />
      </svg>
    ),
    desc: [
      'Công bố Top đề cử xuất sắc',
      'Triển khai chiến dịch truyền thông cao điểm',
      'Chuẩn bị cho đêm Gala'
    ],
    descEn: [
      'Announce the Top outstanding nominees',
      'Launch peak communication campaign',
      'Prepare for the Gala night'
    ]
  },
  {
    date: '09.07.2026',
    title: '6. GALA VITA AWARD', titleEn: '6. VITA AWARD GALA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v6h8V6a4 4 0 0 0-4-4z" />
      </svg>
    ),
    desc: [
      'Đón tiếp khách mời & trải nghiệm sự kiện',
      'Gala VITA AWARD',
      'Truyền hình trực tiếp & Livestream toàn quốc',
      'Vinh danh các hạng mục giải thưởng'
    ],
    descEn: [
      'Welcome guests & event experiences',
      'VITA AWARD Gala',
      'Live broadcast & Nationwide Livestream',
      'Honor the award categories'
    ]
  },
  {
    date: '10.07 - 17.07.2026',
    title: '7. SAU SỰ KIỆN', titleEn: '7. POST-EVENT',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-400)' }}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    desc: [
      'Truyền thông hậu sự kiện',
      'Sản xuất ấn phẩm & video Highlights',
      'Winner Story & Case Study',
      'Đánh giá tổng kết & báo cáo kết quả'
    ],
    descEn: [
      'Post-event communication',
      'Produce publications & Highlights video',
      'Winner Story & Case Study',
      'Final evaluation & results report'
    ]
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function About() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <PageTransition>
      <InteractiveBackground />

      {/* ═══════════════════════════════════════
          SHOWCASE (TÔN VINH) & GIỚI THIỆU VITA AWARD
      ═══════════════════════════════════════ */}
      <section className="apg-section" id="apg-intro">
        <div className="container">
            <div className="apg-showcase">
              {/* Tôn vinh — calligraphy */}
              <motion.span
                className="apg-bigidea-script"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {isEn ? 'Honor' : 'Tôn vinh'}
              </motion.span>

              {/* Gold shimmer line */}
              <motion.div
                className="apg-showcase-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Heading — metallic gold */}
              <motion.h2
                className="apg-showcase-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {isEn ? <>JOURNEYS THAT<br />SHAPE THE FUTURE</> : <>NHỮNG HÀNH TRÌNH<br />KIẾN TẠO TƯƠNG LAI</>}
              </motion.h2>

              {/* Subtitle / Intro text */}
              <motion.p
                className="apg-showcase-sub"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {isEn ? (
                  <><strong>VITA Awards</strong> is a prestigious and noble award system of the Tourism industry, organized annually by the <strong style={{ whiteSpace: 'nowrap' }}>Vietnam Tourism Association (VITA)</strong>.</>
                ) : (
                  <><strong>VITA Awards</strong> là hệ thống giải thưởng uy tín, danh giá của ngành Du lịch<br />do <strong style={{ whiteSpace: 'nowrap' }}>Hiệp hội Du lịch Việt Nam (VITA)</strong> tổ chức thường niên.</>
                )}
              </motion.p>
            </div>

          <ScrollReveal>
            <div className="apg-intro-grid">
              <div className="apg-intro-left">

                <h2 className="apg-sec-heading">
                  {isEn ? 'About' : 'Giới thiệu'} <span className="gold-text">VITA Award</span>
                </h2>
                <div className="apg-gold-rule" />
                
                <p className="apg-goals-label">{isEn ? 'The award aims to:' : 'Giải thưởng được xây dựng nhằm:'}</p>
                <div className="apg-goals-list">
                  {GOALS.map((g, i) => (
                    <motion.div
                      key={i}
                      className="apg-goal-row"
                      whileHover={{ x: 8, backgroundColor: 'rgba(212,175,55,0.08)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="apg-goal-icon">
                        {g.icon}
                      </div>
                      <p>
                        <span className="gold-text" style={{ fontWeight: 700 }}>{isEn && g.boldEn ? g.boldEn : g.bold}</span>{' '}
                        {isEn && g.textEn ? g.textEn : g.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="apg-intro-right">
                <div className="apg-trophy-scene">
                  <div className="apg-trophy-glow" />
                  <div className="apg-trophy-ring apg-tr-1" />
                  <div className="apg-trophy-ring apg-tr-2" />
                  <div className="apg-trophy-ring apg-tr-3" />
                  <img src="/images/Cúp.png" alt="VITA Award Trophy" className="apg-trophy-img" />
                  <div className="apg-trophy-caption">
                    <div className="apg-trophy-tagline">{isEn ? 'HONORING VALUES — CONNECTING THE FUTURE' : 'TÔN VINH GIÁ TRỊ — KẾT NỐI TƯƠNG LAI'}</div>
                    <div className="apg-trophy-sub">{isEn ? 'Vietnam Tourism' : 'Du lịch Việt Nam'}</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          GIÁ TRỊ THƯƠNG HIỆU
      ═══════════════════════════════════════ */}
      <section className="apg-section">
        <div className="container">
          <ScrollReveal>
            <div className="apg-block-head">
              <h2 className="apg-sec-heading">
                {isEn ? 'Brand' : 'Giá trị'} <span className="gold-text">{isEn ? 'Values' : 'Thương hiệu'}</span>
              </h2>
              <div className="apg-gold-rule" />
            </div>
          </ScrollReveal>
                        <motion.ul 
              className="apg-value-list"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {BRAND_VALUES.map((bv, i) => {
                return (
                  <motion.li
                    key={i}
                    className="apg-value-item"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    {/* Aurora glow background inside card */}
                    <div className="apg-value-bg" style={{ background: "radial-gradient(circle at 10% 50%, " + bv.glowColor + ", transparent 60%)" }} />
                    
                    <div className="apg-value-left">
                      <span className="apg-value-num" style={{ color: bv.color }}>0{i + 1}</span>
                      <div className="apg-value-divider" />
                      <div className="apg-value-info">
                        <h4 className="apg-value-title">
                          {isEn && bv.titleEn ? bv.titleEn : bv.title}
                        </h4>
                        <p className="apg-value-desc">
                          {isEn && bv.descEn ? bv.descEn : bv.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="apg-value-right">
                      <div className="apg-value-icon-wrap" style={{ borderColor: bv.color, color: bv.color }}>
                        {bv.icon}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          1.5 — HỆ THỐNG HẠNG MỤC
      ═══════════════════════════════════════ */}
      <section className="apg-section apg-cats-section">
        <div className="container">
          <ScrollReveal>
            <div className="apg-block-head">
              <h2 className="apg-sec-heading">
                {isEn ? 'Award' : 'Hệ thống'} <span className="gold-text">{isEn ? 'Categories' : 'Hạng mục Giải thưởng'}</span>
              </h2>
              <div className="apg-gold-rule" />
            </div>
          </ScrollReveal>
            <motion.ul 
              className="apg-category-list"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {CATEGORIES.map((c, i) => (
                <motion.li
                  key={i}
                  className="apg-cat-item"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  <div className="apg-cat-left">
                    <span className="apg-cat-num">{c.n}</span>
                    <div className="apg-cat-divider" />
                    <span className="apg-cat-name">{isEn && c.nameEn ? c.nameEn : c.name}</span>
                  </div>
                  <div className="apg-cat-right">
                    <div className="apg-cat-icon-wrap">
                      {c.icon}
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

          <ScrollReveal delay={0.2}>
            <div className="apg-bottom-cta">
              <div className="apg-cta-gold-line" />
              <p className="apg-cta-text">
                {isEn ? 'Vote for your favorite nominees in the 2026 season' : 'Bình chọn cho các đề cử yêu thích của bạn trong mùa giải 2026'}
              </p>
              <MagneticElement strength={0.4}>
                <Link to="/vote" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
                  ⭐ {t('nav.vote_now') || 'Bình chọn ngay'}
                </Link>
              </MagneticElement>
              <div className="apg-cta-gold-line" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HÀNH TRÌNH VITA AWARD 2026
      ═══════════════════════════════════════ */}
      <section className="apg-section apg-journey-section">
        <div className="container">
          <ScrollReveal>
            <div className="apg-block-head">
              <div className="apg-journey-badge">
                <span className="apg-jb-line">—</span>
                {isEn ? 'OFFICIAL ROADMAP • SEASON 2026' : 'LỘ TRÌNH CHÍNH THỨC • MÙA GIẢI 2026'}
                <span className="apg-jb-line">—</span>
              </div>
              <h2 className="apg-sec-heading">
                {isEn ? 'The Journey of' : 'Hành trình'} <span className="gold-text">VITA Award 2025</span>
              </h2>
              <div className="apg-gold-rule" />
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: 60, fontSize: 16 }}>
              {isEn ? 'The official roadmap of the season — from nominations launch to the Gala night.' : 'Lộ trình chính thức của mùa giải — từ khởi động đề cử đến đêm Gala vinh danh.'}
            </p>
          </ScrollReveal>

                    <div className="apg-hz-timeline-wrap">
            {JOURNEY_STAGES.map((item, i) => {
              return (
              <motion.div 
                key={i} 
                className="apg-hz-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
              >
                <div className="apg-hz-top-box">
                  <div className="apg-hz-top-box-inner">
                    <h3 className="apg-hz-title">{isEn && item.titleEn ? item.titleEn : item.title}</h3>
                    <div className="apg-hz-date">{item.date}</div>
                  </div>
                  <div className="apg-hz-dashed-line" />
                </div>
                <div className="apg-hz-node-container">
                  <div className="apg-hz-node-line" />
                  <div className="apg-hz-node">
                    <div className="apg-hz-icon">
                      {item.icon}
                    </div>
                  </div>
                </div>
                <div className="apg-hz-bottom">
                  <ul className="apg-hz-desc-list">
                    {(isEn && item.descEn ? item.descEn : item.desc).map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              );
            })}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="apg-timeline-infobar">
              <div className="apg-ib-item">
                <span className="apg-ib-icon">📅</span>
                <div>
                  <div className="apg-ib-label">{isEn ? 'IMPLEMENTATION PERIOD' : 'THỜI GIAN TRIỂN KHAI'}</div>
                  <div className="apg-ib-value">04 - 07.2026</div>
                </div>
              </div>
              <div className="apg-ib-divider" />
              <div className="apg-ib-item">
                <span className="apg-ib-icon">👑</span>
                <div>
                  <div className="apg-ib-label">GALA VITA AWARD</div>
                  <div className="apg-ib-value">09.07.2026</div>
                </div>
              </div>
              <div className="apg-ib-divider" />
              <div className="apg-ib-item">
                <span className="apg-ib-icon">📍</span>
                <div>
                  <div className="apg-ib-label">{isEn ? 'EXPECTED LOCATION' : 'ĐỊA ĐIỂM DỰ KIẾN'}</div>
                  <div className="apg-ib-value">NINH BÌNH</div>
                </div>
              </div>
              <div className="apg-ib-divider" />
              <div className="apg-ib-item">
                <span className="apg-ib-icon">📺</span>
                <div>
                  <div className="apg-ib-label">{isEn ? 'NATIONWIDE LIVESTREAM' : 'LIVESTREAM TOÀN QUỐC'}</div>
                  <div className="apg-ib-value" style={{ fontSize: 13, textTransform: 'none' }}>{isEn ? 'On TV & digital platforms' : 'Trên các nền tảng truyền hình & digital'}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}

