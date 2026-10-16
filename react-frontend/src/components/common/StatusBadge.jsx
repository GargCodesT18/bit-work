/**
 * SupplyGuard Status Badge Component
 */
import React from 'react';

export function StatusBadge({ status = 'Investigating', size = 'md' }) {
  const s = (status || 'investigating').toLowerCase().replace(/\s+/g, '');

  let bg = '#EFF6FF';
  let text = '#1D4ED8';
  let border = '#BFDBFE';

  switch (s) {
    case 'investigating':
      bg = '#EFF6FF';
      text = '#1D4ED8';
      border = '#BFDBFE';
      break;
    case 'planning':
      bg = '#F5F3FF';
      text = '#6D28D9';
      border = '#DDD6FE';
      break;
    case 'awaitingapproval':
    case 'pendingreview':
      bg = '#FFFBEB';
      text = '#B45309';
      border = '#FDE68A';
      break;
    case 'approved':
      bg = '#F0FDF4';
      text = '#15803D';
      border = '#BBF7D0';
      break;
    case 'inprogress':
      bg = '#ECFEFF';
      text = '#0E7490';
      border = '#A5F3FC';
      break;
    case 'resolved':
    case 'completed':
      bg = '#ECFDF5';
      text = '#047857';
      border = '#A7F3D0';
      break;
    case 'rejected':
    case 'cancelled':
    case 'blocked':
      bg = '#FEF2F2';
      text = '#B91C1C';
      border = '#FECACA';
      break;
    default:
      bg = '#F1F5F9';
      text = '#475569';
      border = '#CBD5E1';
  }

  return (
    <span
      className="badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '1px 6px' : '2px 8px',
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
