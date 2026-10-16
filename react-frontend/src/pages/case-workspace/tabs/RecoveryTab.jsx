import React from 'react';
import { TrustBadge } from '../../../components/common/TrustBadge.jsx';
import { formatCurrency, formatNumber } from '../../../utils/formatters.js';

export function RecoveryTab({ caseData, selectedOptionId, onSelectOption }) {
  const { recoveryOptions } = caseData;

  const getFeasibilityStyles = (feasibility) => {
    switch (feasibility) {
      case 'Feasible':
        return { bg: '#ECFDF5', text: '#047857' };
      case 'Needs Verification':
        return { bg: '#FEF3C7', text: '#92400E' };
      default:
        return { bg: '#FEF2F2', text: '#B91C1C' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-navy)' }}>
            Recovery Strategy Trade-Off Matrix
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Select an option to evaluate lead time trade-offs, financial commitment, and stockout mitigation.
          </p>
        </div>
        <TrustBadge state="estimate" labelOverride="Deterministic Trade-Off Analysis" size="sm" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {recoveryOptions.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          const isRec = opt.isRecommended;
          const feas = getFeasibilityStyles(opt.feasibility);

          return (
            <div
              key={opt.id}
              className="sg-card"
              onClick={() => onSelectOption(opt.id)}
              style={{
                padding: 'var(--space-4)',
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid var(--color-primary)'
                  : isRec
                  ? '2px solid #99F6E4'
                  : '1px solid var(--color-border)',
                backgroundColor: isSelected ? '#F8FAFF' : '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="code-tag font-bold">{opt.id}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {isRec && <span className="badge badge-low">Recommended</span>}
                    <span
                      className="badge"
                      style={{ backgroundColor: feas.bg, color: feas.text }}
                    >
                      {opt.feasibility}
                    </span>
                  </div>
                </div>

                <h4 style={{ fontSize: '15px', color: 'var(--color-navy)', marginBottom: '2px' }}>{opt.name}</h4>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>{opt.type}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ backgroundColor: '#F1F5F9', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>LEAD TIME</div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-navy)' }}>{opt.leadTimeDisplay}</div>
                  </div>
                  <div style={{ backgroundColor: '#F1F5F9', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>EST. COST</div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-navy)' }}>
                      {opt.estimatedCost === 0 ? '$0 (Baseline)' : formatCurrency(opt.estimatedCost)}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#F1F5F9', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>SHORTAGE AVERTED</div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color: opt.shortageReductionPct > 80 ? 'var(--color-teal)' : 'var(--color-warning)',
                      }}
                    >
                      {opt.shortageReductionPct}% ({formatNumber(opt.unitsRecovered)} u)
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#F1F5F9', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>SELECTION</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {isSelected ? 'Active Choice' : 'Click to Pick'}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  <strong>Capacity Constraints:</strong> {opt.capacityConstraints}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  <strong>Risks & Assumptions:</strong> {opt.risksAndAssumptions}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Anchors: {opt.supportingEvidence.join(', ') || 'None'}
                </span>
                <button
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOption(opt.id);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Strategy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

