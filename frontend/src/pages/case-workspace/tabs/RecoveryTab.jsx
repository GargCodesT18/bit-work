import React from 'react';
import { TrustBadge } from '../../../components/common/TrustBadge.jsx';
import { formatCurrency, formatNumber } from '../../../utils/formatters.js';

export function RecoveryTab({ caseData, selectedOptionId, onSelectOption }) {
  const { recoveryOptions } = caseData;

  const getFeasibilityStyles = (feasibility) => {
    switch (feasibility) {
      case 'Feasible':
        return {
          bg: 'var(--color-bone)',
          text: 'var(--color-bistre)',
          border: '1px solid var(--color-quill)',
          dot: 'var(--color-chartreuse-whisper)',
        };
      case 'Needs Verification':
        return {
          bg: 'var(--color-bone)',
          text: 'var(--color-slate)',
          border: '1px solid var(--color-quill)',
          dot: 'var(--color-flint)',
        };
      default:
        return {
          bg: 'var(--color-bone)',
          text: 'var(--color-bistre)',
          border: '1px solid var(--color-bistre)',
          dot: 'var(--color-bistre)',
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-bistre)' }}>
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
                  ? '2px solid var(--color-bistre)'
                  : isRec
                  ? '2px solid var(--color-quill)'
                  : '1px solid var(--color-quill)',
                backgroundColor: isSelected ? 'var(--color-bone)' : 'var(--color-bone)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSelected ? '0 10px 25px -5px rgba(26, 22, 20, 0.12)' : 'none',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="code-tag font-bold">{opt.id}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {isRec && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: 'var(--color-chartreuse-whisper)',
                          color: 'var(--color-bistre)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 'var(--font-weight-medium)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        Recommended
                      </span>
                    )}
                    <span
                      className="badge"
                      style={{
                        backgroundColor: feas.bg,
                        color: feas.text,
                        border: feas.border,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: feas.dot,
                          display: 'inline-block',
                        }}
                      />
                      {opt.feasibility}
                    </span>
                  </div>
                </div>

                <h4 style={{ fontSize: '15px', color: 'var(--color-bistre)', marginBottom: '2px' }}>{opt.name}</h4>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>{opt.type}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ backgroundColor: 'var(--color-cream)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-quill)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>LEAD TIME</div>
                    <div style={{ fontWeight: '500', fontSize: '13px', color: 'var(--color-bistre)' }}>{opt.leadTimeDisplay}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-cream)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-quill)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>EST. COST</div>
                    <div style={{ fontWeight: '500', fontSize: '13px', color: 'var(--color-bistre)' }}>
                      {opt.estimatedCost === 0 ? '$0 (Baseline)' : formatCurrency(opt.estimatedCost)}
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-cream)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-quill)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>SHORTAGE AVERTED</div>
                    <div style={{ fontWeight: '500', fontSize: '13px', color: 'var(--color-bistre)' }}>
                      {opt.shortageReductionPct}% ({formatNumber(opt.unitsRecovered)} u)
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-cream)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-quill)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>SELECTION</div>
                    <div style={{ fontWeight: '500', fontSize: '12px', color: isSelected ? 'var(--color-bistre)' : 'var(--color-text-muted)' }}>
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

              <div style={{ borderTop: '1px solid var(--color-quill)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
