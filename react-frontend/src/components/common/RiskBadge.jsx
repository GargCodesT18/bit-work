/**
 * SupplyGuard Risk Badge Component
 */
import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export function RiskBadge({ risk = 'Low', size = 'md' }) {
  const r = (risk || 'low').toLowerCase();

  let bg = '#E8F5F3';
  let text = '#11685C';
  let border = '#99D5CC';
  let Icon = CheckCircle2;

  switch (r) {
    case 'critical':
      bg = '#FEF2F2';
      text = '#B91C1C';
      border = '#FECACA';
      Icon = AlertCircle;
      break;
    case 'high':
      bg = '#FFF7ED';
      text = '#C2410C';
      border = '#FED7AA';
      Icon = AlertTriangle;
      break;
    case 'medium':
      bg = '#FEFCE8';
      text = '#A16207';
      border = '#FEF08A';
      Icon = Info;
      break;
    default:
      bg = '#E8F5F3';
      text = '#11685C';
      border = '#99D5CC';
      Icon = CheckCircle2;
  }

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className="badge"
      aria-label={`Risk level: ${risk}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
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
      <Icon size={iconSize} aria-hidden="true" style={{ flexShrink: 0 }} />
      <span>{risk} Risk</span>
    </span>
  );
}
