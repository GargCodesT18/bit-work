import React from 'react';
import { Plus } from 'lucide-react';
import { TrustBadge } from '../../../components/common/TrustBadge.jsx';
import { formatDateTime } from '../../../utils/formatters.js';

export function EvidenceTab({ caseData, onOpenAddEvidence }) {
  const { evidence } = caseData;

  const getBorderColor = (state) => {
    switch (state) {
      case 'Verified':
        return 'var(--color-teal)';
      case 'Stale':
        return 'var(--color-warning)';
      case 'Conflicting':
        return 'var(--color-critical)';
      default:
        return '#94A3B8';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-navy)' }}>
            Authoritative Evidence & Ingested Telemetry
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Every operational claim is anchored to verifiable telemetry records.
          </p>
        </div>
        <button onClick={onOpenAddEvidence} className="btn btn-primary btn-sm">
          <Plus size={14} />
          <span>Attach Supporting Evidence</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {evidence.map((ev) => (
          <div
            key={ev.id}
            className="sg-card"
            style={{ borderLeft: `4px solid ${getBorderColor(ev.verificationState)}` }}
          >
            <div className="sg-card-header">
              <span className="code-tag font-bold">{ev.id}</span>
              <TrustBadge state={ev.verificationState} size="sm" />
            </div>
            <div className="sg-card-body">
              <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', fontSize: '14px', marginBottom: '2px' }}>
                {ev.source}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                {ev.type} • {formatDateTime(ev.timestamp)}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                {ev.summary}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                <span>Confidence: <strong>{ev.confidence}</strong></span>
                <span className="font-mono text-xs">{ev.documentRef}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

