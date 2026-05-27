import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const closeAndReset = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }, 300);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast(t('auth.err_missing'), 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast(t('auth.err_pass_mismatch'), 'error');
      return;
    }
    if (currentPassword === newPassword) {
      addToast(t('auth.err_same_pass'), 'error');
      return;
    }
    // Giả lập đổi mật khẩu thành công
    setStep(2);
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

        {step === 1 && (
          <div className="step active">
            <h3 style={{ marginBottom: '8px', fontSize: '1.6rem' }}>{t('auth.change_pass')}</h3>
            <p className="modal-sub" style={{ marginBottom: '24px' }}>{t('auth.change_pass_desc')}</p>
            
            <form onSubmit={handleChangePassword}>
              <div className="form-group" style={{ position: 'relative', marginBottom: '16px' }}>
                <input 
                  type={showCurrent ? 'text' : 'password'} 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  placeholder={t('auth.current_pass')} 
                  style={{ width: '100%', padding: '14px 45px 14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <EyeIcon show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '16px' }}>
                <input 
                  type={showNew ? 'text' : 'password'} 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  placeholder={t('auth.new_pass')} 
                  style={{ width: '100%', padding: '14px 45px 14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
              </div>

              <div className="form-group" style={{ position: 'relative', marginBottom: '24px' }}>
                <input 
                  type={showConfirm ? 'text' : 'password'} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder={t('auth.confirm_new_pass')} 
                  style={{ width: '100%', padding: '14px 45px 14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '1.1rem' }}>
                {t('auth.btn_change')}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="step active" style={{ textAlign: 'center' }}>
            <div className="modal-logo" style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
            <h3 style={{ marginBottom: '10px' }}>{t('auth.change_pass')} <span className="gold-text">{t('auth.change_success')}</span>!</h3>
            <p className="modal-sub" style={{ marginBottom: '30px' }}>{t('auth.change_success_desc')}</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeAndReset}>{t('auth.btn_done')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
