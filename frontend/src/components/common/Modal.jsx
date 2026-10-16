/**
 * SupplyGuard Accessible Modal Dialog Component
 */
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = '560px' }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Focus first interactive element
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) focusable.focus();
        }
      }, 50);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(10, 19, 36, 0.65)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="sg-card"
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--color-bone)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px -15px rgba(26, 22, 20, 0.2)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--color-quill)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--color-quill)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 id="modal-title" style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-bistre)' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="btn-icon"
            style={{ marginLeft: '12px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 'var(--space-5)',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
