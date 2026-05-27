import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../App';
import { auth, db, isConfigured } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function LoginModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { addToast } = useToast();
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [phone, setPhone] = useState(''); // Can be email or phone
  const [password, setPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [step, setStep] = useState(1); // 1: form, 2: success

  if (!isOpen) return null;

  const closeAndReset = () => {
    onClose();
    setTimeout(() => {
      setIsLoginMode(true);
      setStep(1);
      setPhone('');
      setPassword('');
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }, 300);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      addToast(t('auth.err_missing') || 'Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    
    if (!isConfigured) {
      // Mock mode
      setIsLoggedIn(true);
      setUser({
        uid: 'mock-uid',
        name: phone === '0908780188' ? 'Hoàng Huy' : 'Voter',
        email: `${phone}@vita-award.com`,
        phone: phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
        role: phone === '0908780188' ? 'admin' : 'user'
      });
      addToast(t('auth.toast_login_success') || 'Đăng nhập thành công', 'success');
      setStep(2);
      return;
    }

    try {
      // Map phone logins to formatted email credential if they don't type a normal email
      const email = phone.includes('@') ? phone : `${phone.replace(/[^0-9+]/g, '')}@vita-award.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile immediately
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: userCredential.user.uid,
          name: userData.name || userCredential.user.displayName || 'Voter',
          email: userCredential.user.email,
          phone: userData.phone || userCredential.user.phoneNumber || '',
          avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.uid}`,
          role: userData.role || 'user'
        });
      } else {
        setUser({
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || 'Voter',
          email: userCredential.user.email,
          phone: userCredential.user.phoneNumber || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.uid}`,
          role: 'user'
        });
      }
      setIsLoggedIn(true);

      addToast(t('auth.toast_login_success') || 'Đăng nhập thành công', 'success');
      setStep(2);
    } catch (error) {
      console.error(error);
      addToast(t('auth.err_invalid_credentials') || 'Số điện thoại hoặc mật khẩu không chính xác', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regPhone || !regPassword || !regConfirmPassword) {
      addToast(t('auth.err_missing') || 'Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      addToast(t('auth.err_pass_mismatch') || 'Mật khẩu nhập lại không khớp', 'error');
      return;
    }

    if (!isConfigured) {
      // Mock mode
      setIsLoggedIn(true);
      setUser({
        uid: 'mock-uid',
        name: regName,
        email: regEmail || `${regPhone}@vita-award.com`,
        phone: regPhone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regPhone}`,
        role: 'user'
      });
      addToast(t('auth.reg_success') || 'Đăng ký thành công', 'success');
      setStep(2);
      return;
    }

    const emailToUse = regEmail.trim() || `${regPhone.replace(/[^0-9+]/g, '')}@vita-award.com`;

    try {
      // Register with actual email & password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, emailToUse, regPassword);
      const firebaseUser = userCredential.user;
      
      // Save details to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        name: regName,
        phone: regPhone,
        email: regEmail.trim() || '',
        role: 'user', // Default role
        createdAt: new Date().toISOString()
      });

      // Update local context immediately!
      setUser({
        uid: firebaseUser.uid,
        name: regName,
        email: emailToUse,
        phone: regPhone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        role: 'user'
      });
      setIsLoggedIn(true);

      addToast(t('auth.reg_success') || 'Đăng ký thành công', 'success');
      setStep(2);
    } catch (error) {
      console.error(error);
      addToast(error.message || 'Đăng ký thất bại', 'error');
    }
  };

  const EyeIcon = ({ show, toggle }) => (
    <span 
      onClick={toggle}
      style={{ 
        position: 'absolute', 
        right: '16px', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        cursor: 'pointer', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        userSelect: 'none',
        color: '#fff'
      }}
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </span>
  );

  return (
    <div className="modal-overlay show" onClick={(e) => { if(e.target === e.currentTarget) closeAndReset() }}>
      <div className="modal" style={{ maxWidth: '420px', padding: '40px 30px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeAndReset}>✕</button>

        {step === 1 && isLoginMode && (
          <div className="step active">
            <img src="/images/Logo 1.png" alt="Logo" style={{ height: '54px', margin: '0 auto 20px', display: 'block', objectFit: 'contain' }} />
            <h3 style={{ marginBottom: '8px' }}>{t('auth.login_title')} <span className="gold-text">VITA Award</span></h3>
            <p className="modal-sub" style={{ marginBottom: '30px' }}>{t('auth.desc_login')}</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gold-200)', marginBottom: '8px', display: 'block' }}>{t('auth.phone')}</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder={isEn ? "Enter phone number" : "Nhập số điện thoại"} 
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '30px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gold-200)', marginBottom: '8px', display: 'block' }}>{t('auth.password')}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder={isEn ? "Enter password" : "Nhập mật khẩu"} 
                    style={{ width: '100%', padding: '14px 45px 14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem' }}
                  />
                  <EyeIcon show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '1.1rem', marginBottom: '20px' }}>
                {t('auth.btn_login')}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
              {t('auth.no_account')} <span onClick={() => setIsLoginMode(false)} style={{ color: 'var(--gold-300)', cursor: 'pointer', fontWeight: 'bold' }}>{t('auth.register_now')}</span>
            </div>
          </div>
        )}

        {step === 1 && !isLoginMode && (
          <div className="step active">
            <h3 style={{ marginBottom: '8px', fontSize: '1.6rem' }}>{t('auth.register_title')} <span className="gold-text">{t('auth.highlight')}</span></h3>
            <p className="modal-sub" style={{ marginBottom: '24px' }}>{t('auth.desc_register')}</p>
            
            <form onSubmit={handleRegister}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <input 
                  type="text" 
                  value={regName} 
                  onChange={e => setRegName(e.target.value)} 
                  placeholder={t('auth.fullname')} 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <input 
                  type="tel" 
                  value={regPhone} 
                  onChange={e => setRegPhone(e.target.value)} 
                  placeholder={t('auth.phone')} 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <input 
                  type="email" 
                  value={regEmail} 
                  onChange={e => setRegEmail(e.target.value)} 
                  placeholder={`${t('auth.email') || 'Email'} ${isEn ? '(Optional)' : '(Không bắt buộc)'}`} 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '16px' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={regPassword} 
                  onChange={e => setRegPassword(e.target.value)} 
                  placeholder={t('auth.password')} 
                  style={{ width: '100%', padding: '12px 45px 12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <EyeIcon show={showPassword} toggle={() => setShowPassword(!showPassword)} />
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '24px' }}>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={regConfirmPassword} 
                  onChange={e => setRegConfirmPassword(e.target.value)} 
                  placeholder={t('auth.re_password')} 
                  style={{ width: '100%', padding: '12px 45px 12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <EyeIcon show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontSize: '1.05rem', marginBottom: '20px' }}>
                {t('auth.btn_register')}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
              {t('auth.has_account')} <span onClick={() => setIsLoginMode(true)} style={{ color: 'var(--gold-300)', cursor: 'pointer', fontWeight: 'bold' }}>{t('auth.login_now')}</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step active" style={{ textAlign: 'center' }}>
            <div className="modal-logo" style={{ fontSize: '4rem', marginBottom: '20px' }}>👋</div>
            <h3 style={{ marginBottom: '10px' }}>{t('auth.welcome')} <span className="gold-text">VITA Award</span>!</h3>
            <p className="modal-sub" style={{ marginBottom: '30px' }}>{t('auth.welcome_desc')}</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeAndReset}>{t('auth.start_vote')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
