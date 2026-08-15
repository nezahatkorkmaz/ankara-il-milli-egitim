import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 40px)',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-item toast-${t.type}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: t.type === 'success' ? '#064e3b' : t.type === 'error' ? '#7f1d1d' : '#0f172a',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            fontSize: '13.5px',
            fontWeight: 600,
            lineHeight: 1.4,
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {t.type === 'success' && <CheckCircle size={18} color="#34d399" style={{ flexShrink: 0 }} />}
          {t.type === 'error' && <AlertCircle size={18} color="#fca5a5" style={{ flexShrink: 0 }} />}
          {t.type === 'info' && <Info size={18} color="#93c5fd" style={{ flexShrink: 0 }} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              padding: 0,
              flexShrink: 0,
            }}
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
