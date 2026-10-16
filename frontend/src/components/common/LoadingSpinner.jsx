/**
 * SupplyGuard Loading Spinner Component
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading operational telemetry...', height = '240px' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        gap: '12px',
        color: 'var(--color-text-secondary)',
      }}
      role="status"
      aria-live="polite"
    >
      <Loader2 size={24} className="spinner" style={{ color: 'var(--color-primary)' }} />
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
        {message}
      </span>
    </div>
  );
}
