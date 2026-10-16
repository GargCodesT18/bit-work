/**
 * SupplyGuard Supply Network Nodes Page - Antimetal Editorial
 */
import React from 'react';
import { Network, Building2, Truck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RunwayBar } from '../../components/common/RunwayBar.jsx';
import { TrustBadge } from '../../components/common/TrustBadge.jsx';

export function NetworkPage() {
  const nodes = [
    {
      id: 'LOC-A',
      name: 'Central Distribution Center (DC A)',
      type: 'Primary Inbound Hub',
      location: 'Omaha, NE',
      onHand: 14000,
      dailyOutflow: 2000,
      coverageDays: 7.0,
      safetyMandateDays: 4.0,
      status: 'Healthy Buffer',
      transferCapacity: 4500,
      activeAlerts: 0,
    },
    {
      id: 'LOC-B',
      name: 'Metro Regional Depot (Depot B)',
      type: 'Regional Fulfillment Depot',
      location: 'Chicago, IL',
      onHand: 1200,
      dailyOutflow: 1150,
      coverageDays: 1.04,
      safetyMandateDays: 4.0,
      status: 'Critical Stockout Risk',
      transferCapacity: 0,
      activeAlerts: 1,
    },
    {
      id: 'LOC-PAC-04',
      name: 'Pacific Northwest Cold Hub (WH-PAC-04)',
      type: 'Refrigerated Cold Storage',
      location: 'Yakima, WA',
      onHand: 12000,
      dailyOutflow: 3000,
      coverageDays: 4.0,
      safetyMandateDays: 3.5,
      status: 'Quarantine / Spoilage Hazard',
      transferCapacity: 0,
      activeAlerts: 1,
    },
    {
      id: 'LOC-EST-01',
      name: 'Eastern Distribution Center',
      type: 'Primary Inbound Hub',
      location: 'Allentown, PA',
      onHand: 18000,
      dailyOutflow: 2100,
      coverageDays: 8.5,
      safetyMandateDays: 4.0,
      status: 'Adequate Buffer',
      transferCapacity: 6000,
      activeAlerts: 1,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-bistre)', letterSpacing: '-0.02em' }}>
          Supply Network & Distribution Nodes
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Live operational status, on-hand inventory, daily consumption run-rates, and stockout runways across primary nodes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {nodes.map((node) => {
          const isCrit = node.coverageDays <= 2.0;
          return (
            <div
              key={node.id}
              className="sg-card"
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-bone)',
                border: '1px solid var(--color-quill)',
                borderLeft: isCrit ? '3px solid var(--color-bistre)' : '1px solid var(--color-quill)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', color: 'var(--color-bistre)', fontWeight: '500' }}>{node.name}</h3>
                    <div className="font-mono text-xs text-muted">
                      {node.id} • {node.type} • {node.location}
                    </div>
                  </div>
                  <span className={`badge ${isCrit ? 'badge-critical' : 'badge-low'}`}>
                    {node.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0' }}>
                  <div style={{ backgroundColor: 'var(--color-cream)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-quill)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>ON-HAND INVENTORY</div>
                    <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--color-bistre)' }}>
                      {node.onHand.toLocaleString()} units
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-cream)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-quill)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>DAILY OUTFLOW</div>
                    <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--color-bistre)' }}>
                      {node.dailyOutflow.toLocaleString()} u/day
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-bistre)' }}>
                      Stockout Runway:
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '500',
                        color: 'var(--color-bistre)',
                      }}
                    >
                      {node.coverageDays.toFixed(1)} Days
                    </span>
                  </div>
                  <RunwayBar days={node.coverageDays} safetyStockDays={node.safetyMandateDays} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-quill)', paddingTop: '10px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                <span>Transfer Available: <strong>{node.transferCapacity > 0 ? `+${node.transferCapacity.toLocaleString()} u` : 'None'}</strong></span>
                <TrustBadge state={isCrit ? 'stale' : 'verified'} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
