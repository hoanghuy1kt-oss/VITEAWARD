import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: 'rgba(5, 13, 40, 0.9)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${toast.type === 'error' ? '#ff4d4f' : toast.type === 'success' ? '#52c41a' : 'var(--gold-400)'}`,
            borderRadius: '12px',
            padding: '12px 20px',
            color: '#fff',
            minWidth: '280px',
            maxWidth: '350px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'auto',
            animation: 'toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            fontFamily: 'Be Vietnam Pro',
            fontSize: '0.95rem'
          }}>
            <span style={{ fontSize: '1.4rem' }}>
              {toast.type === 'error' ? '❌' : toast.type === 'success' ? '✅' : '🔔'}
            </span>
            <div style={{ flex: 1, lineHeight: '1.4' }}>{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
