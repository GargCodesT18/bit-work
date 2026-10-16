/**
 * SupplyGuard Status Badge Component — Antimetal Palette
 * Zero saturated neon colors.
 */
import React from 'react';

export function StatusBadge({ status = 'Investigating', size = 'md' }) {
  const s = (status || 'investigating').toLowerCase().replace(/\s+/g, '');

  let bg = 'rgba(26, 22, 20, 0.04)';
  let text = '#53504c';
  let border = 'rgba(26, 22, 20, 0.12)';

  switch (s) {
    case 'investigating':
      bg = 'rgba(26, 22, 20, 0.06)';
      text = '#1a1614';
      border = 'rgba(26, 22, 20, 0.18)';
      break;
    case 'planning':
      bg = 'rgba(26, 22, 20, 0.05)';
      text = '#53504c';
      border = 'rgba(26, 22, 20, 0.12)';
      break;
    case 'awaitingapproval':
    case 'pendingreview':
      bg = 'rgba(226, 230, 125, 0.35)';
      text = '#1a1614';
      border = 'rgba(226, 230, 125, 0.7)';
      break;
    case 'approved':
    case 'resolved':
    case 'completed':
      bg = '#1a1614';
      text = '#f4f4e7';
      border = '#1a1614';
      break;
    case 'inprogress':
      bg = 'rgba(226, 230, 125, 0.2)';
      text = '#1a1614';
      border = 'rgba(226, 230, 125, 0.5)';
      break;
    case 'rejected':
    case 'cancelled':
    case 'blocked':
      bg = 'rgba(26, 22, 20, 0.1)';
      text = '#2a2724';
      border = 'rgba(26, 22, 20, 0.25)';
      break;
    default:
      bg = 'rgba(26, 22, 20, 0.04)';
      text = '#66635f';
      border = 'rgba(26, 22, 20, 0.1)';
  }

  return (
    <span
      className="badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '2px 7px' : '3px 10px',
        fontFamily: 'var(--font-geist-mono, monospace)',
        fontSize: size === 'sm' ? '10px' : '11px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
