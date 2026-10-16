import React from 'react';
import { StatusBadge } from '../../../components/common/StatusBadge.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

export function OutcomeTab({ caseData, onUpdateOutcome }) {
  const { outcome } = caseData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="sg-card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '15px', color: 'var(--color-bistre)', fontWeight: '500' }}>
              Post-Approval Execution & Outcome Tracking
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Track dispatch execution, verify stockout aversion milestones, and resolve variance.
            </p>
          </div>
          <StatusBadge status={outcome.executionStatus} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'var(--color-cream)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-quill)' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>EXECUTION STATUS</div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-bistre)' }}>{outcome.executionStatus}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Resolution: {outcome.resolutionState}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-cream)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-quill)' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>ACTUAL EXPENDITURE</div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-bistre)' }}>
              {outcome.actualCost !== null ? formatCurrency(outcome.actualCost) : 'Pending Invoicing'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Budgeted: $1,450</div>
          </div>

          <div style={{ backgroundColor: 'var(--color-cream)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-quill)' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>STOCKOUT AVERTED</div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-bistre)' }}>
              {outcome.actualStockoutHours !== null ? `${outcome.actualStockoutHours} Hours` : 'Tracking In-Flight'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Projected averted: 25h</div>
          </div>
        </div>

        <div className="sg-card" style={{ padding: '14px', backgroundColor: 'var(--color-bone)', border: '1px solid var(--color-quill)', marginBottom: '14px' }}>
          <h5 style={{ fontSize: '13px', color: 'var(--color-bistre)', fontWeight: '500', marginBottom: '8px' }}>
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
              className="btn btn-primary btn-sm"
            >
              Mark as Completed & Resolved
            </button>
            <button
              onClick={() => onUpdateOutcome('Blocked', 'Corridor fog delay halted carrier on Highway 80.')}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--color-quill)', color: 'var(--color-slate)' }}
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
