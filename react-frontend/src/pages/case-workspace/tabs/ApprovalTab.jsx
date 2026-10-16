import React from 'react';
import { ShieldCheck, CheckCircle2, Search, AlertOctagon } from 'lucide-react';
import { StatusBadge } from '../../../components/common/StatusBadge.jsx';
import { formatDateTime } from '../../../utils/formatters.js';

export function ApprovalTab({
  caseData,
  approverName,
  setApproverName,
  approvalNotes,
  setApprovalNotes,
  onDecision,
  approvalStampRef,
}) {
  const { recommendation, approval } = caseData;
  const isApproved = approval?.status === 'Approved';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        className="sg-card"
        style={{
          backgroundColor: '#F0FDFA',
          border: '1px solid #99F6E4',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-teal)' }} />
            <h3 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>
              Recommended Action: {recommendation.title}
            </h3>
          </div>
          <span className="badge badge-low">Recommended Candidate</span>
        </div>

        <p style={{ fontSize: '14px', color: '#134E48', lineHeight: 1.5, marginBottom: '12px' }}>
          {recommendation.rationale}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', backgroundColor: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #CCEDE8' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-navy)', textTransform: 'uppercase' }}>
              Trade-offs Considered:
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {recommendation.tradeoffs}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#B45309', textTransform: 'uppercase' }}>
              Uncertainties & Boundary Conditions:
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {recommendation.uncertainty}
            </div>
          </div>
        </div>
      </div>

      <div className="sg-card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '15px', color: 'var(--color-navy)' }}>
              Operations Manager Authorization
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              High-impact operational commitments require human authorization. The model assists with options; the operator holds execution accountability.
            </p>
          </div>
          <StatusBadge status={approval?.status || 'Pending Review'} />
        </div>

        {isApproved && (
          <div
            ref={approvalStampRef}
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircle2 size={24} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 'bold', color: '#11685C', fontSize: '14px' }}>
                Recommendation Authorized & Execution Initiated
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                Approved by: <strong>{approval.approverName}</strong> at {formatDateTime(approval.timestamp)}.
              </div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                Decision Note: <em>"{approval.notes}"</em>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-navy)', marginBottom: '4px' }}>
              Approver Full Name & Title *
            </label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              required
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-navy)', marginBottom: '4px' }}>
              Authorization Notes & Operational Constraints
            </label>
            <textarea
              rows={3}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Add specific instructions for logistics dispatch..."
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => onDecision('approve')}
              className="btn btn-teal"
            >
              <CheckCircle2 size={16} />
              <span>Approve Recommendation</span>
            </button>

            <button
              type="button"
              onClick={() => onDecision('investigate')}
              className="btn btn-secondary"
            >
              <Search size={16} />
              <span>Request More Investigation</span>
            </button>

            <button
              type="button"
              onClick={() => onDecision('reject')}
              className="btn btn-critical"
            >
              <AlertOctagon size={16} />
              <span>Reject Strategy</span>
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span className="badge badge-demo">Demo Safety Rule</span>
          <span>Clicking Approve updates simulation state and records compliance audit history. No real freight is dispatched.</span>
        </div>
      </div>
    </div>
  );
}

