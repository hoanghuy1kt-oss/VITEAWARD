import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      addToast(t('auth.err_missing'), 'error');
      return;
    }
    // Giả lập đăng nhập thành công
    setStep(2);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regPhone || !regEmail || !regPassword || !regConfirmPassword) {
      addToast(t('auth.err_missing'), 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      addToast(t('auth.err_pass_mismatch'), 'error');
      return;
    }
    // Giả lập đăng ký thành công
    addToast(t('auth.reg_success'), 'success');
    setIsLoginMode(true);
    setPhone(regPhone);
    setPassword(regPassword);
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
        fontSize: '1.2rem',
        opacity: 0.6,
        userSelect: 'none'
      }}
    >
      {show ? '👁️' : '🙈'}
    </span>
  );

  return (
    <div className="modal-overlay show" onClick={(e) => { if(e.target === e.currentTarget) closeAndReset() }}>
      <div className="modal" style={{ maxWidth: '420px', padding: '40px 30px' }}>
        <button className="modal-close" onClick={closeAndReset}>✕</button>

        {step === 1 && isLoginMode && (
          <div className="step active">
            <img src="/images/Logo 1.png" alt="Logo" style={{ height: '54px', margin: '0 auto 20px', display: 'block', objectFit: 'contain' }} />
            <h3 style={{ marginBottom: '8px' }}>{t('login.title') || 'Đăng nhập'} <span className="gold-text">VITA Award</span></h3>
            <p className="modal-sub" style={{ marginBottom: '30px' }}>Chào mừng bạn quay trở lại. Vui lòng đăng nhập để bình chọn.</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gold-200)', marginBottom: '8px', display: 'block' }}>Số điện thoại</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="Nhập số điện thoại" 
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem' }}
                />
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '30px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gold-200)', marginBottom: '8px', display: 'block' }}>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Nhập mật khẩu" 
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
                  placeholder={t('auth.email')} 
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
            <h3 style={{ marginBottom: '10px' }}>{t('login.welcome')} <span className="gold-text">VITA Award</span>!</h3>
            <p className="modal-sub" style={{ marginBottom: '30px' }}>{t('login.welcome_desc')}</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeAndReset}>{t('login.start_vote')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
