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
import Admin from './pages/Admin';

import { auth, db, isConfigured } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

export const AuthContext = createContext();

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!isConfigured);
  const [user, setUser] = useState(!isConfigured ? { name: 'Hoàng Huy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huy', role: 'admin' } : null);

  useEffect(() => {
    if (!isConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userDoc = await getDoc(userDocRef);
          
          // Retry logic: if the user just registered, setDoc might still be in progress.
          // Retry up to 3 times with 500ms intervals if doc doesn't exist yet.
          if (!userDoc.exists()) {
            for (let i = 0; i < 3; i++) {
              await new Promise(resolve => setTimeout(resolve, 500));
              userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) break;
            }
          }

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'Voter',
              email: firebaseUser.email,
              phone: userData.phone || firebaseUser.phoneNumber || '',
              avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              role: userData.role || 'user'
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Voter',
              email: firebaseUser.email,
              phone: firebaseUser.phoneNumber || '',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              role: 'user'
            });
          }
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Voter',
            email: firebaseUser.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            role: 'user'
          });
          setIsLoggedIn(true);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
