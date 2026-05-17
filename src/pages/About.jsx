import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import MagneticElement from '../components/MagneticElement';
import InteractiveBackground from '../components/InteractiveBackground';

const GOALS = [
  { imgIcon: '/images/Icon ton vinh.png', bold: 'Tôn vinh', boldEn: 'Honor', text: 'các tổ chức, doanh nghiệp, địa phương và cá nhân tiêu biểu ngành du lịch', textEn: 'outstanding organizations, enterprises, localities, and individuals in the tourism industry' },
  { imgIcon: '/images/Icon du lich.png', bold: 'Ghi nhận', boldEn: 'Recognize', text: 'các mô hình phát triển du lịch chất lượng, sáng tạo và bền vững', textEn: 'high-quality, creative, and sustainable tourism development models' },
  { imgIcon: '/images/Icon lan toa.png', bold: 'Lan tỏa', boldEn: 'Spread', text: 'hình ảnh du lịch Việt Nam hiện đại, giàu bản sắc', textEn: 'the image of a modern and culturally rich Vietnam tourism' },
  { imgIcon: '/images/icon ket noi.png', bold: 'Kết nối', boldEn: 'Connect', text: 'cộng đồng du lịch trên nền tảng truyền thông số', textEn: 'the tourism community on a digital media platform' },
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
    iconImg: '/images/Icon chua.png',
    title: 'Bản sắc\nViệt Nam', titleEn: 'Vietnam\nIdentity',
    desc: 'Tôn vinh văn hóa, con người\nvà điểm đến Việt Nam.', descEn: 'Honoring the culture, people\nand destinations of Vietnam.',
    hasBadge: true,
  },
  {
    iconImg: '/images/Icon lá.png',
    title: 'Phát triển\nbền vững', titleEn: 'Sustainable\nDevelopment',
    desc: 'Hướng tới tương lai xanh\ncho ngành du lịch.', descEn: 'Moving towards a green future\nfor the tourism industry.',
  },
  {
    iconImg: '/images/Icon nui.png',
    title: 'Truyền cảm hứng', titleEn: 'Inspiring',
    desc: 'Lan tỏa những câu chuyện\ntích cực & giá trị thật.', descEn: 'Spreading positive stories\nand true values.',
  },
  {
    iconImg: '/images/Icon bat tay.png',
    title: 'Kết nối cộng đồng', titleEn: 'Community Connection',
    desc: 'Gắn kết doanh nghiệp, địa phương\nvà cộng đồng du lịch.', descEn: 'Connecting businesses, localities,\nand the tourism community.',
  },
];
const CATEGORIES = [
  { n: '01', imgIcon: '/images/Icon Địa phương.png', name: 'Địa phương có chính sách đột phá, sáng tạo phát triển du lịch hàng đầu', nameEn: 'Leading localities with breakthrough and creative policies for tourism development' },
  { n: '02', imgIcon: '/images/Icon hoa sen.png', name: 'Làng Du lịch tốt nhất', nameEn: 'Best Tourism Villages' },
  { n: '03', imgIcon: '/images/Icon diem den.png', name: 'Điểm đến - Công viên Du lịch hàng đầu', nameEn: 'Leading Destinations - Tourism Parks' },
  { n: '04', imgIcon: '/images/Icon san pham du lich.png', name: 'Sản phẩm du lịch mới nổi hàng đầu', nameEn: 'Leading emerging tourism products' },
  { n: '05', imgIcon: '/images/Icon may bay.png', name: 'Doanh nghiệp lữ hành hàng đầu', nameEn: 'Leading Tour Operators' },
  { n: '06', imgIcon: '/images/icon hotel.png', name: 'Cơ sở lưu trú, nhà hàng du lịch hàng đầu', nameEn: 'Leading Accommodations and Restaurants' },
  { n: '07', imgIcon: '/images/Icon tau.png', name: 'Đơn vị vận chuyển du lịch được yêu thích hàng đầu', nameEn: 'Leading Tourist Transport Providers' },
  { n: '08', imgIcon: '/images/icon tiktok.png', name: 'Giải Chuyên đề TikTok (Quảng bá du lịch hiệu quả)', nameEn: 'TikTok Special Awards (Effective tourism promotion)' },
];
const JOURNEY_STAGES = [
  {
    date: '20.04 - 10.05.2026',
    title: '1. KHỞI ĐỘNG', titleEn: '1. KICK-OFF',
    imgIcon: '/images/Icon khoi dong.png',
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
    date: '11.05 - 30.05.2026',
    title: '2. TRUYỀN THÔNG & MỞ ĐỀ CỬ', titleEn: '2. COMMUNICATION & NOMINATIONS OPEN',
    imgIcon: '/images/icon truyen thong.png',
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
    imgIcon: '/images/Icon tiếp nhận.png',
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
    date: '15.06 - 30.06.2026',
    title: '4. CHUNG KHẢO & BÌNH CHỌN', titleEn: '4. FINAL ROUND & VOTING',
    imgIcon: '/images/icon chung khao.png',
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
    date: '01.07 - 07.07.2026',
    title: '5. CÔNG BỐ ĐỀ CỬ', titleEn: '5. ANNOUNCE NOMINEES',
    imgIcon: '/images/Icon cong bo.png',
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
    imgIcon: '/images/Icon cúp.png',
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
    imgIcon: '/images/Icon sau sk.png',
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

  const isCurrentStage = (dateStr) => {
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    const currentTimestamp = current.getTime();
  
    try {
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        const startStr = parts[0].trim();
        const endStr = parts[1].trim();
  
        const endParts = endStr.split('.');
        const year = parseInt(endParts[2], 10);
        const endMonth = parseInt(endParts[1], 10) - 1;
        const endDay = parseInt(endParts[0], 10);
  
        const startParts = startStr.split('.');
        const startDay = parseInt(startParts[0], 10);
        const startMonth = parseInt(startParts[1], 10) - 1;
        const startYear = startParts.length === 3 ? parseInt(startParts[2], 10) : year;
  
        const startDate = new Date(startYear, startMonth, startDay).getTime();
        const endDate = new Date(year, endMonth, endDay, 23, 59, 59).getTime();
  
        return currentTimestamp >= startDate && currentTimestamp <= endDate;
      } else {
        const parts = dateStr.trim().split('.');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
  
        const startDate = new Date(year, month, day).getTime();
        const endDate = new Date(year, month, day, 23, 59, 59).getTime();
  
        return currentTimestamp >= startDate && currentTimestamp <= endDate;
      }
    } catch (e) {
      return false;
    }
  };

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
                  <><strong>VITA AWARD</strong> is the Vietnam Tourism Award hosted by the <strong>Vietnam Tourism Association (VITA)</strong>, in coordination with <span className="gold-text">Vietnam Travel</span> Magazine and strategic partners.</>
                ) : (
                  <><strong>VITA AWARD</strong> là Giải thưởng Du lịch Việt Nam do <strong>Hiệp hội Du lịch Việt Nam (VITA)</strong> chủ trì tổ chức, phối hợp cùng Tạp chí <span className="gold-text">Vietnam Travel</span> và các đối tác chiến lược triển khai.</>
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
                        <img src={g.imgIcon} alt={g.bold} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
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
            <motion.div 
              className="apg-bento-grid"
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
              {BRAND_VALUES.map((bv, i) => (
                <motion.div
                  key={i}
                  className={`apg-bento-item apg-bento-item-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  <div className="apg-bento-bg" />
                  <div className="apg-bento-content">
                    {bv.hasBadge && (
                      <div className="apg-bento-badge">CORE VALUE</div>
                    )}
                    <div className="apg-bento-icon">
                      <img src={bv.iconImg} alt={bv.title.replace('\n', ' ')} />
                    </div>
                    <div className="apg-bento-text">
                      <h4 className="apg-bento-title">
                        {(isEn && bv.titleEn ? bv.titleEn : bv.title).split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx !== (isEn && bv.titleEn ? bv.titleEn : bv.title).split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h4>
                      {i !== 0 && <div className="apg-bento-line" />}
                      <p className="apg-bento-desc">
                        {(isEn && bv.descEn ? bv.descEn : bv.desc).split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx !== (isEn && bv.descEn ? bv.descEn : bv.desc).split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="apg-bento-glow" />
                </motion.div>
              ))}
            </motion.div>
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
                    <div className="apg-cat-icon-wrap" style={{ padding: '8px' }}>
                      <img src={c.imgIcon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
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
              const highlight = isCurrentStage(item.date);
              return (
              <motion.div 
                key={i} 
                className={`apg-hz-item ${highlight ? 'apg-hz-highlight' : ''}`}
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
                    <div className="apg-hz-icon" style={{ padding: '6px' }}>
                      <img src={item.imgIcon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
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

