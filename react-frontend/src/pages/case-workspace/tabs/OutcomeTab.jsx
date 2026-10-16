import React from 'react';
import { StatusBadge } from '../../../components/common/StatusBadge.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

export function OutcomeTab({ caseData, onUpdateOutcome }) {
  const { outcome } = caseData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '15px', color: 'var(--color-navy)' }}>
              Post-Approval Execution & Outcome Tracking
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Track dispatch execution, verify stockout aversion milestones, and resolve variance.
            </p>
          </div>
          <StatusBadge status={outcome.executionStatus} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>EXECUTION STATUS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-navy)' }}>{outcome.executionStatus}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Resolution: {outcome.resolutionState}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>ACTUAL EXPENDITURE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-navy)' }}>
              {outcome.actualCost !== null ? formatCurrency(outcome.actualCost) : 'Pending Invoicing'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Budgeted: $1,450</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>STOCKOUT AVERTED</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-teal)' }}>
              {outcome.actualStockoutHours !== null ? `${outcome.actualStockoutHours} Hours` : 'Tracking In-Flight'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Projected averted: 25h</div>
          </div>
        </div>

        <div className="sg-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', marginBottom: '14px' }}>
          <h5 style={{ fontSize: '13px', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Simulate Execution Milestones (Demo Simulation Controller)
          </h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onUpdateOutcome('In Progress', 'Carrier truck #4902 dispatched from Central DC.')}
              className="btn btn-secondary btn-sm"
            >
              Mark as In Progress
            </button>
            <button
              onClick={() => onUpdateOutcome('Completed', '3,500 units safely received at Depot B dock. Stockout fully averted.', 1450, 3500)}
              className="btn btn-teal btn-sm"
            >
              Mark as Completed & Resolved
            </button>
            <button
              onClick={() => onUpdateOutcome('Blocked', 'Corridor fog delay halted carrier on Highway 80.')}
              className="btn btn-critical btn-sm"
            >
              Mark as Blocked
            </button>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Latest Execution Note: <em>"{outcome.notes || 'No notes logged.'}"</em>
        </div>
      </div>
    </div>
  );
}

