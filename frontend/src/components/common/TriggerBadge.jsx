/**
 * SupplyGuard Trigger Source Badge Component - Antimetal Editorial
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
        gap: '5px',
        padding: size === 'sm' ? '1px 8px' : '3px 10px',
        fontSize: size === 'sm' ? '10px' : '11px',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: 'var(--color-bone)',
        color: isProactive ? 'var(--color-bistre)' : 'var(--color-slate)',
        border: `1px solid ${isProactive ? 'var(--color-quill)' : 'var(--color-quill)'}`,
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: isProactive ? 'var(--color-chartreuse-whisper)' : 'var(--color-flint)',
          border: isProactive ? '1px solid var(--color-bistre)' : 'none',
          display: 'inline-block',
        }}
      />
      <Icon size={size === 'sm' ? 10 : 11} style={{ flexShrink: 0, opacity: 0.7 }} />
      <span>{label}</span>
    </span>
  );
}

