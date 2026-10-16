/**
 * SupplyGuard Enterprise Recovery Plans Ledger
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Filter } from 'lucide-react';
import { getRecoveryPlans } from '../../services/recovery/recoveryService.js';
import { RiskBadge } from '../../components/common/RiskBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';

export function RecoveryPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await getRecoveryPlans();
        setPlans(res);
      } catch (err) {
        console.error('Failed to load recovery plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const filtered = approvalFilter === 'All'
    ? plans
    : plans.filter(
        (p) =>
          p.approvalState.toLowerCase().replace(/\s+/g, '') ===
          approvalFilter.toLowerCase().replace(/\s+/g, '')
      );

  if (loading) {
    return <LoadingSpinner message="Aggregating enterprise recovery strategies..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
            Enterprise Recovery Plans
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Consolidated ledger of formulated, recommended, and authorized mitigation initiatives across cases.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="rec-filter" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Approval State:
          </label>
          <select
            id="rec-filter"
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">All States</option>
            <option value="PendingReview">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Alternative">Alternative Candidates</option>
          </select>
        </div>
      </div>

      <div className="sg-card">
        <div className="data-table-container">
          <table className="data-table" aria-label="Enterprise Recovery Plans">
            <thead>
              <tr>
                <th scope="col">Case ID & Risk</th>
                <th scope="col">Proposed Mitigation Action</th>
                <th scope="col">Strategy Type</th>
                <th scope="col">Lead Time</th>
                <th scope="col">Estimated Cost</th>
                <th scope="col">Shortage Relief</th>
                <th scope="col">Approval State</th>
                <th scope="col">Execution State</th>
                <th scope="col">Approver</th>
                <th scope="col" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={`${p.caseId}-${p.optionId}-${idx}`}
                  className="row-interactive"
                  onClick={() => navigate(`/disruptions/${p.caseId}`)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span className="code-tag font-bold">{p.caseId}</span>
                      <RiskBadge risk={p.risk} size="sm" />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.caseTitle}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
                      {p.actionName}
                    </div>
                    {p.isRecommended && <span className="badge badge-low" style={{ marginTop: '2px' }}>Recommended</span>}
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.type}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{p.leadTimeDisplay}</span>
                  </td>
                  <td>
                    <span className="font-mono font-semibold">
                      {p.estimatedCost === 0 ? '$0' : formatCurrency(p.estimatedCost)}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: p.shortageReductionPct > 80 ? 'var(--color-teal)' : 'var(--color-warning)',
                      }}
                    >
                      {p.shortageReductionPct}%
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={p.approvalState} size="sm" />
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.executionState === 'Completed'
                          ? 'badge-low'
                          : p.executionState === 'In Progress'
                          ? 'badge-high'
                          : 'badge-status-investigating'
                      }`}
                    >
                      {p.executionState}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px' }}>{p.approverName}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/disruptions/${p.caseId}`);
                      }}
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
