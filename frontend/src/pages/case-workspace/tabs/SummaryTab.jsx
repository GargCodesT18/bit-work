import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { TrustBadge } from '../../../components/common/TrustBadge.jsx';
import { formatDateTime } from '../../../utils/formatters.js';

export function SummaryTab({ caseData }) {
  const { product, supplier, shipment, summary, impactAssessment } = caseData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Product / SKU
          </span>
          <div style={{ fontWeight: '500', color: 'var(--color-bistre)', marginTop: '4px', fontSize: '15px' }}>
            {product.name}
          </div>
          <div className="font-mono text-xs text-muted" style={{ marginTop: '2px' }}>
            {product.sku} • Cost: ${product.unitCost}
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Primary Supplier
          </span>
          <div style={{ fontWeight: '500', color: 'var(--color-bistre)', marginTop: '4px', fontSize: '15px' }}>
            {supplier.name}
          </div>
          <div className="font-mono text-xs text-muted" style={{ marginTop: '2px' }}>
            {supplier.id} • Rel: {supplier.reliabilityScore}
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Shipment / PO
          </span>
          <div style={{ fontWeight: '500', color: 'var(--color-bistre)', marginTop: '4px', fontSize: '15px' }}>
            {shipment.id} ({shipment.poNumber})
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {shipment.carrier} • {shipment.shippedQuantity?.toLocaleString()} {shipment.unit}
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Revised Delay
          </span>
          <div style={{ fontWeight: '600', color: 'var(--color-bistre)', marginTop: '4px', fontSize: '15px' }}>
            +{shipment.delayDays} Days Delayed
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Original: {formatDateTime(shipment.originalEta).split(' ')[0]}
          </div>
        </div>
      </div>

      <div className="sg-card" style={{ borderLeft: '3px solid var(--color-bistre)', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
        <div className="sg-card-header" style={{ borderBottom: '1px solid var(--color-quill)' }}>
          <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-bistre)' }}>Disruption Briefing</h3>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            Last Verified: {formatDateTime(impactAssessment.lastVerifiedTimestamp)}
          </span>
        </div>
        <div className="sg-card-body">
          <p style={{ fontSize: 'var(--font-size-base)', fontWeight: '500', color: 'var(--color-bistre)', marginBottom: '8px' }}>
            {summary.headline}
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            {summary.whatHappened}
          </p>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate)' }}>
            Operational Urgency: {summary.urgency}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div className="sg-card" style={{ backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
          <div className="sg-card-header" style={{ borderBottom: '1px solid var(--color-quill)' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--color-bistre)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>Known Verified Facts</h4>
            <TrustBadge state="verified" size="sm" />
          </div>
          <div className="sg-card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary.knownFacts.map((fact, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-graphite)' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--color-bistre)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sg-card" style={{ backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
          <div className="sg-card-header" style={{ borderBottom: '1px solid var(--color-quill)' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--color-bistre)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>Unverified Claims & Assumptions</h4>
            <TrustBadge state="unverified" size="sm" />
          </div>
          <div className="sg-card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary.unverifiedClaims.map((claim, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-graphite)' }}>
                  <AlertTriangle size={14} style={{ color: 'var(--color-slate)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
