/**
 * SupplyGuard Error State Component
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function ErrorState({
  title = 'Operational telemetry unavailable',
  message = 'An unexpected error occurred while loading this view.',
  onRetry = null,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-10) var(--space-4)',
        textAlign: 'center',
      }}
      role="alert"
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bone)',
          border: '1px solid var(--color-quill)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-bistre)',
          marginBottom: '12px',
        }}
      >
        <AlertTriangle size={20} />
      </div>
      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-bistre)', marginBottom: '4px' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: onRetry ? '16px' : '0' }}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm">
          Retry Request
        </button>
      )}
    </div>
  );
}
