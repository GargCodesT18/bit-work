/**
 * SupplyGuard Toast Notification Context
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        className="toast-container"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '420px',
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              boxShadow: '0 10px 15px -3px rgba(20, 35, 59, 0.15)',
              borderLeft: `4px solid ${
                toast.type === 'success'
                  ? 'var(--color-teal)'
                  : toast.type === 'warning'
                  ? 'var(--color-warning)'
                  : toast.type === 'error'
                  ? 'var(--color-critical)'
                  : 'var(--color-primary)'
              }`,
              borderTop: '1px solid var(--color-border)',
              borderRight: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
            }}
          >
            {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />}
            {toast.type === 'warning' && <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />}
            {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--color-critical)', flexShrink: 0 }} />}
            {toast.type === 'info' && <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}

            <span style={{ flex: 1 }}>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              style={{
                color: 'var(--color-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
