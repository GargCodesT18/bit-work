import React from 'react';
import { TrustBadge } from '../../../components/common/TrustBadge.jsx';
import { RunwayBar } from '../../../components/common/RunwayBar.jsx';
import { formatNumber, formatCurrency, formatTimeAgo, formatDateTime } from '../../../utils/formatters.js';

export function ImpactTab({ caseData }) {
  const { impactAssessment } = caseData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Delayed Inbound
            </span>
            <TrustBadge state="verified" size="sm" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
            {formatNumber(impactAssessment.totalUnitsDelayed)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>units</span>
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Estimated Shortage
            </span>
            <TrustBadge state="estimate" size="sm" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-critical)' }}>
            {formatNumber(impactAssessment.estimatedTotalShortage)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>units</span>
          </div>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Financial Exposure
            </span>
            <TrustBadge state="estimate" size="sm" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
            {formatCurrency(impactAssessment.financialRiskExposure)}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Lost margin + SLA penalty</span>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Telemetry Freshness
            </span>
            <TrustBadge state="stale" size="sm" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
            {formatTimeAgo(impactAssessment.lastVerifiedTimestamp)}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {formatDateTime(impactAssessment.lastVerifiedTimestamp)}
          </span>
        </div>
      </div>

      <div className="sg-card">
        <div className="sg-card-header">
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>
              Facility Stock Coverage & Stockout Runway Forecast
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Differential runway calculated deterministically across receiving network nodes
            </div>
          </div>
          <TrustBadge state="estimate" size="sm" />
        </div>

        <div className="data-table-container">
          <table className="data-table" aria-label="Facility Stock Runway">
            <thead>
              <tr>
                <th scope="col">Facility Name & Role</th>
                <th scope="col">On-Hand Stock</th>
                <th scope="col">Safety Mandate</th>
                <th scope="col">Daily Outflow</th>
                <th scope="col" style={{ width: '220px' }}>Days Coverage & Runway</th>
                <th scope="col">Runway Status</th>
                <th scope="col">Transfer Capacity</th>
              </tr>
            </thead>
            <tbody>
              {impactAssessment.locations.map((loc) => {
                const isCrit = loc.daysCoverage <= 2.0;
                return (
                  <tr key={loc.id}>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>{loc.name}</div>
                      <div className="font-mono text-xs text-muted">{loc.id} • {loc.role}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatNumber(loc.onHand)} units</div>
                      <div style={{ marginTop: '2px' }}>
                        <TrustBadge state={isCrit ? 'stale' : 'verified'} size="sm" />
                      </div>
                    </td>
                    <td>
                      <div>{formatNumber(loc.safetyStock)} units</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>(4.0d policy)</div>
                    </td>
                    <td>{formatNumber(loc.dailyDemand)} u/day</td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-bold)', color: isCrit ? 'var(--color-critical)' : 'var(--color-teal)', fontSize: '15px' }}>
                        {loc.daysCoverage.toFixed(1)} Days
                      </div>
                      <RunwayBar days={loc.daysCoverage} />
                    </td>
                    <td>
                      <span className={`badge ${isCrit ? 'badge-critical' : 'badge-low'}`}>
                        {loc.coverageStatus}
                      </span>
                      {loc.projectedStockoutHours && (
                        <div style={{ fontSize: '11px', color: 'var(--color-critical)', fontWeight: 'bold', marginTop: '2px' }}>
                          Stockout in ~{loc.projectedStockoutHours} hrs
                        </div>
                      )}
                    </td>
                    <td>
                      {loc.transferAvailableUnits > 0 ? (
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-teal)' }}>
                          +{formatNumber(loc.transferAvailableUnits)} units available
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>0 (Buffer locked)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sg-card" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
        <div className="sg-card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrustBadge state="assumption" size="sm" />
            <h4 style={{ fontSize: '13px', color: 'var(--color-navy)' }}>Calculation Modeling Assumptions</h4>
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {impactAssessment.calculationAssumptions.map((assumption, idx) => (
              <li key={idx}>{assumption}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

