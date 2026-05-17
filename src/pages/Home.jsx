import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import MagneticElement from '../components/MagneticElement';
import InteractiveBackground from '../components/InteractiveBackground';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function Home() {
  const { t } = useTranslation();
  return (
    <PageTransition>
      <InteractiveBackground />

      {/* ═══════════════════════════════════════
          HERO — Inspired by PDF cover page
      ═══════════════════════════════════════ */}
      <section className="apg-hero">
        <div className="apg-hero-inner">
          {/* Left content */}
          <motion.div
            className="apg-hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="apg-hero-badge"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="apg-badge-dot" />
              {t('hero.season')}
            </motion.div>

            <motion.h1 className="apg-hero-heading" {...fadeUp} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <span className="apg-hero-script">{t('hero.award_name')}</span>
              <span className="apg-hero-title-main">
                VITA <span className="gold-text">AWARD</span>
              </span>
              <span className="apg-hero-year-block">2025</span>
            </motion.h1>

            <motion.p
              className="apg-hero-lead"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              dangerouslySetInnerHTML={{ __html: t('hero.lead') }}
            />

            {/* Core value badges */}
            <motion.div
              className="apg-hero-cv-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {[
                { icon: '/images/Icon chua.png', label1: t('about.cv1_1'), label2: t('about.cv1_2') },
                { icon: '/images/Icon lá.png', label1: t('about.cv2_1'), label2: t('about.cv2_2') },
                { icon: '/images/Icon nui.png', label1: t('about.cv3_1'), label2: t('about.cv3_2') },
                { icon: '/images/Icon bat tay.png', label1: t('about.cv4_1'), label2: t('about.cv4_2') },
              ].map((cv, i) => (
                <motion.div
                  key={i}
                  className="apg-cv-badge"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
                >
                  <img src={cv.icon} alt={cv.label1} className="apg-cv-icon" />
                  <div className="apg-cv-text">
                    <span>{cv.label1}</span>
                    <span>{cv.label2}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="apg-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <MagneticElement strength={0.4}>
                <Link to="/vote" className="btn btn-primary">⭐ {t('nav.vote_now')}</Link>
              </MagneticElement>
              <MagneticElement strength={0.2}>
                <a href="#apg-intro" className="btn btn-ghost">{t('hero.learn_more')}</a>
              </MagneticElement>
            </motion.div>
          </motion.div>

          {/* Right — Diagonal Image Strips */}
          <motion.div
            className="apg-hero-right"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="apg-diag-panel">
              {/* Collage image */}
              <div className="apg-collage-img" />
              {/* Gold decorative swirl */}
              <svg className="apg-gold-swirl" viewBox="0 0 120 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 0 C 30 100, 10 200, 60 300 C 100 380, 110 430, 80 500"
                  stroke="url(#swirl-grad)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
                <defs>
                  <linearGradient id="swirl-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(212,175,55,0)" />
                    <stop offset="30%" stopColor="rgba(212,175,55,0.6)" />
                    <stop offset="70%" stopColor="rgba(212,175,55,0.5)" />
                    <stop offset="100%" stopColor="rgba(212,175,55,0)" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Gold dots */}
              <div className="apg-diag-dots">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="apg-dot"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </div>
            </div>
            {/* Vietnam Travel logo overlay */}
            <div className="apg-vt-logo">
              <span className="apg-vt-text">Vietnam<em>Travel</em></span>
            </div>
          </motion.div>
        </div>

      </section>

    </PageTransition>
  );
}
