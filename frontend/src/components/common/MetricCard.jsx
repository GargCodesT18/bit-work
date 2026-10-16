/**
 * SupplyGuard KPI Metric Card
 */
import React from 'react';

export function MetricCard({ label, value, subtext, valueColor, trustState = null, isDemo = true }) {
  return (
    <div
      className="sg-card"
      style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', fontWeight: 500, color: 'var(--color-graphite, #66635f)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        {isDemo && (
          <span
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(226, 230, 125, 0.3)',
              color: 'var(--color-bistre, #1a1614)',
              border: '1px solid rgba(226, 230, 125, 0.6)',
              fontWeight: 500,
            }}
          >
            Demo data
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 400,
            color: valueColor || 'var(--color-bistre, #1a1614)',
            lineHeight: 1,
            fontFamily: 'var(--font-test-signifier, serif)',
          }}
        >
          {value}
        </span>
      </div>

      {subtext && (
        <span style={{ fontSize: '12px', color: 'var(--color-graphite, #66635f)' }}>
          {subtext}
        </span>
      )}
    </div>
  );
}
