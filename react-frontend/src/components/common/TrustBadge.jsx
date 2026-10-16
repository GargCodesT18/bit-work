/**
 * SupplyGuard Data Trust Badge Component
 * The 6-State Data Trust Model:
 * 1. Verified Fact
 * 2. Estimate
 * 3. Assumption
 * 4. Unknown
 * 5. Stale Data
 * 6. Conflicting Evidence
 */
import React from 'react';
import { CheckCircle2, Calculator, Bookmark, HelpCircle, Clock, AlertOctagon } from 'lucide-react';

export function TrustBadge({ state = 'unknown', labelOverride = null, size = 'md' }) {
  const s = (state || 'unknown').toLowerCase();

  let bg = 'var(--trust-unknown-bg)';
  let text = 'var(--trust-unknown-text)';
  let border = 'var(--trust-unknown-border)';
  let label = labelOverride || 'Unknown';
  let tooltip = 'Information is unavailable; awaiting telemetry, dispatch slip, or manual verification.';
  let Icon = HelpCircle;

  switch (s) {
    case 'verified':
      bg = 'var(--trust-verified-bg)';
      text = 'var(--trust-verified-text)';
      border = 'var(--trust-verified-border)';
      label = labelOverride || 'Verified Fact';
      tooltip = 'Backed by authoritative carrier EDI, sensor telemetry, or audited warehouse record.';
      Icon = CheckCircle2;
      break;

    case 'estimate':
      bg = 'var(--trust-estimate-bg)';
      text = 'var(--trust-estimate-text)';
      border = 'var(--trust-estimate-border)';
      label = labelOverride || 'Estimate';
      tooltip = 'Calculated or projected based on consumption rates, lead times, or run-rate models.';
      Icon = Calculator;
      break;

    case 'assumption':
      bg = 'var(--trust-assumption-bg)';
      text = 'var(--trust-assumption-text)';
      border = 'var(--trust-assumption-border)';
      label = labelOverride || 'Assumption';
      tooltip = 'Applied heuristic or standard operational baseline due to missing or delayed inputs.';
      Icon = Bookmark;
      break;

    case 'stale':
      bg = 'var(--trust-stale-bg)';
      text = 'var(--trust-stale-text)';
      border = 'var(--trust-stale-border)';
      label = labelOverride || 'Stale Data';
      tooltip = 'Authoritative record exists but has passed the operational freshness threshold (>4h).';
      Icon = Clock;
      break;

    case 'conflicting':
      bg = 'var(--trust-conflicting-bg)';
      text = 'var(--trust-conflicting-text)';
      border = 'var(--trust-conflicting-border)';
      label = labelOverride || 'Conflicting Evidence';
      tooltip = 'Independent data sources or telemetry feeds report contradictory parameters.';
      Icon = AlertOctagon;
      break;

    default:
      bg = 'var(--trust-unknown-bg)';
      text = 'var(--trust-unknown-text)';
      border = 'var(--trust-unknown-border)';
      label = labelOverride || 'Unknown';
      tooltip = 'Information is unavailable; awaiting telemetry, dispatch slip, or manual verification.';
      Icon = HelpCircle;
  }

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className="trust-badge"
      title={tooltip}
      aria-label={`${label}: ${tooltip}`}
      tabIndex={0}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
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
