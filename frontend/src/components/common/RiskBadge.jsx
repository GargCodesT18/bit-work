/**
 * SupplyGuard Risk Badge Component — Antimetal Quiet Palette
 * Zero saturated red/green/blue. Uses Bistre, Graphite, Slate, and Chartreuse Whisper.
 */
import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export function RiskBadge({ risk = 'Low', size = 'md' }) {
  const r = (risk || 'low').toLowerCase();

  let bg = 'rgba(26, 22, 20, 0.04)';
  let text = '#66635f';
  let border = 'rgba(26, 22, 20, 0.1)';
  let Icon = CheckCircle2;

  switch (r) {
    case 'critical':
      bg = '#1a1614';
      text = '#f4f4e7';
      border = '#1a1614';
      Icon = AlertCircle;
      break;
    case 'high':
      bg = 'rgba(226, 230, 125, 0.35)';
      text = '#1a1614';
      border = 'rgba(226, 230, 125, 0.7)';
      Icon = AlertTriangle;
      break;
    case 'medium':
      bg = 'rgba(26, 22, 20, 0.06)';
      text = '#53504c';
      border = 'rgba(26, 22, 20, 0.14)';
      Icon = Info;
      break;
    default:
      bg = 'rgba(26, 22, 20, 0.03)';
      text = '#66635f';
      border = 'rgba(26, 22, 20, 0.08)';
      Icon = CheckCircle2;
  }

  const iconSize = size === 'sm' ? 11 : 13;

  return (
    <span
      className="badge"
      aria-label={`Risk level: ${risk}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
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
      <Icon size={iconSize} aria-hidden="true" style={{ flexShrink: 0 }} />
      <span>{risk} Risk</span>
    </span>
  );
}

export default RiskBadge;
