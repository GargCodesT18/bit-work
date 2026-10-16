import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { TrustBadge } from '../../../components/common/TrustBadge.jsx';
import { formatDateTime } from '../../../utils/formatters.js';

export function SummaryTab({ caseData }) {
  const { product, supplier, shipment, summary, impactAssessment } = caseData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Product / SKU
          </span>
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', marginTop: '2px' }}>
            {product.name}
          </div>
          <div className="font-mono text-xs text-muted" style={{ marginTop: '2px' }}>
            {product.sku} • Cost: ${product.unitCost}
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Primary Supplier
          </span>
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', marginTop: '2px' }}>
            {supplier.name}
          </div>
          <div className="font-mono text-xs text-muted" style={{ marginTop: '2px' }}>
            {supplier.id} • Rel: {supplier.reliabilityScore}
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Shipment / PO
          </span>
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', marginTop: '2px' }}>
            {shipment.id} ({shipment.poNumber})
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {shipment.carrier} • {shipment.shippedQuantity?.toLocaleString()} {shipment.unit}
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Revised Delay
          </span>
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-critical)', marginTop: '2px' }}>
            +{shipment.delayDays} Days Delayed
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Original: {formatDateTime(shipment.originalEta).split(' ')[0]}
          </div>
        </div>
      </div>

      <div className="sg-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <div className="sg-card-header">
          <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>Disruption Briefing</h3>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Last Verified: {formatDateTime(impactAssessment.lastVerifiedTimestamp)}
          </span>
        </div>
        <div className="sg-card-body">
          <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-navy)', marginBottom: '8px' }}>
            {summary.headline}
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            {summary.whatHappened}
          </p>
          <div style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semibold)', color: '#C2410C' }}>
            Operational Urgency: {summary.urgency}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div className="sg-card" style={{ backgroundColor: '#F8FCFB', border: '1px solid #99D5CC' }}>
          <div className="sg-card-header" style={{ borderBottom: '1px solid #CCEDE8' }}>
            <h4 style={{ fontSize: '13px', color: '#11685C' }}>Known Verified Facts</h4>
            <TrustBadge state="verified" size="sm" />
          </div>
          <div className="sg-card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {summary.knownFacts.map((fact, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#134E48' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sg-card" style={{ backgroundColor: '#FFFDF5', border: '1px solid #FDE68A' }}>
          <div className="sg-card-header" style={{ borderBottom: '1px solid #FEF3C7' }}>
            <h4 style={{ fontSize: '13px', color: '#B45309' }}>Unverified Claims & Assumptions</h4>
            <TrustBadge state="unverified" size="sm" />
          </div>
          <div className="sg-card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {summary.unverifiedClaims.map((claim, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#92400E' }}>
                  <AlertTriangle size={15} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
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

