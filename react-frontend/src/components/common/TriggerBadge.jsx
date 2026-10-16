/**
 * SupplyGuard Trigger Source Badge Component
 */
import React from 'react';
import { Activity, Bell } from 'lucide-react';

export function TriggerBadge({ source = 'Proactive', size = 'md' }) {
  const isProactive = (source || 'proactive').toLowerCase() === 'proactive';
  const label = isProactive ? 'Proactive Signal' : 'Reported Alert';
  const Icon = isProactive ? Activity : Bell;

  return (
    <span
      className="badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '1px 6px' : '2px 8px',
        fontSize: size === 'sm' ? '11px' : 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: isProactive ? '#EFF6FF' : '#FEF3C7',
        color: isProactive ? '#1D4ED8' : '#92400E',
        border: `1px solid ${isProactive ? '#BFDBFE' : '#FDE68A'}`,
        borderRadius: 'var(--radius-sm)',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={size === 'sm' ? 10 : 12} style={{ flexShrink: 0 }} />
      <span>{label}</span>
    </span>
  );
}
