import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ToastProvider } from './context/ToastContext';

import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import FloatingStars from './components/FloatingStars';

import Home from './pages/Home';
import About from './pages/About';
import Vote from './pages/Vote';
import Results from './pages/Results';
import News from './pages/News';
import Events from './pages/Events';
import Sponsors from './pages/Sponsors';

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/results" element={<Results />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </AnimatePresence>
  );
}

export const AuthContext = createContext();

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({ name: 'Hoàng Huy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huy' });

  return (
    <ToastProvider>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, setIsModalOpen, setIsChangePasswordOpen }}>
        <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FloatingStars />
        <Header onOpenModal={() => setIsModalOpen(true)} />
        <main style={{ minHeight: '100vh' }}>
          <AnimatedRoutes />
        </main>
        <Footer />
        <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
        </motion.div>
      </Router>
      </AuthContext.Provider>
    </ToastProvider>
  );
}
