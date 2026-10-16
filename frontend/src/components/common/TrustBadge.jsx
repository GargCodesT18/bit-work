/**
 * SupplyGuard Data Trust Badge Component — Antimetal Quiet Palette
 * 6-state trust model using Bistre, Slate, Graphite, and Chartreuse Whisper.
 * Zero saturated neon colors.
 */
import React from 'react';
import { CheckCircle2, Calculator, Bookmark, HelpCircle, Clock, AlertOctagon } from 'lucide-react';

export function TrustBadge({ state = 'unknown', labelOverride = null, size = 'md' }) {
  const s = (state || 'unknown').toLowerCase();

  let bg = 'rgba(26, 22, 20, 0.04)';
  let text = '#53504c';
  let border = 'rgba(26, 22, 20, 0.12)';
  let label = labelOverride || 'Unknown';
  let tooltip = 'Information is unavailable; awaiting telemetry, dispatch slip, or manual verification.';
  let Icon = HelpCircle;

  switch (s) {
    case 'verified':
      bg = 'rgba(226, 230, 125, 0.35)';
      text = '#1a1614';
      border = 'rgba(226, 230, 125, 0.7)';
      label = labelOverride || 'Verified Fact';
      tooltip = 'Backed by authoritative carrier EDI, sensor telemetry, or audited warehouse record.';
      Icon = CheckCircle2;
      break;

    case 'estimate':
      bg = 'rgba(26, 22, 20, 0.06)';
      text = '#1a1614';
      border = 'rgba(26, 22, 20, 0.18)';
      label = labelOverride || 'Estimate';
      tooltip = 'Calculated or projected based on consumption rates, lead times, or run-rate models.';
      Icon = Calculator;
      break;

    case 'assumption':
      bg = 'rgba(26, 22, 20, 0.05)';
      text = '#53504c';
      border = 'rgba(26, 22, 20, 0.12)';
      label = labelOverride || 'Assumption';
      tooltip = 'Applied heuristic or standard operational baseline due to missing or delayed inputs.';
      Icon = Bookmark;
      break;

    case 'stale':
      bg = 'rgba(26, 22, 20, 0.08)';
      text = '#66635f';
      border = 'rgba(26, 22, 20, 0.16)';
      label = labelOverride || 'Stale Data';
      tooltip = 'Authoritative record exists but has passed the operational freshness threshold (>4h).';
      Icon = Clock;
      break;

    case 'conflicting':
      bg = '#1a1614';
      text = '#f4f4e7';
      border = '#1a1614';
      label = labelOverride || 'Conflicting Evidence';
      tooltip = 'Multiple reputable data sources report incompatible values; manual review required.';
      Icon = AlertOctagon;
      break;

    default:
      bg = 'rgba(26, 22, 20, 0.04)';
      text = '#66635f';
      border = 'rgba(26, 22, 20, 0.1)';
      label = labelOverride || 'Unknown';
      tooltip = 'Data point is missing or unverified.';
      Icon = HelpCircle;
  }

  const iconSize = size === 'sm' ? 11 : 13;

  return (
    <span
      className="trust-badge"
      title={tooltip}
      aria-label={`${label}: ${tooltip}`}
      tabIndex={0}
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
        lineHeight: 1.4,
        cursor: 'help',
      }}
    >
      <Icon size={iconSize} aria-hidden="true" style={{ flexShrink: 0 }} />
      <span>{label}</span>
    </span>
  );
}

export default TrustBadge;
