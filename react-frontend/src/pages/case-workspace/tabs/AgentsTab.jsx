import React from 'react';
import { formatTimeAgo } from '../../../utils/formatters.js';

export function AgentsTab({ caseData }) {
  const { agentTasks } = caseData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-navy)' }}>
          Specialized Agent Execution Trace
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Auditable stream of specialist agent findings, sensor cross-referencing, and safety policy checks.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {agentTasks.map((task) => (
          <div key={task.id} className="sg-card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    fontWeight: 'bold',
                  }}
                >
                  {task.agent}
                </span>
                <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', fontSize: '14px' }}>
                  {task.title}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${task.status === 'Completed' ? 'badge-low' : 'badge-high'}`}>
                  {task.status}
                </span>
                <span className="font-mono text-xs text-muted">
                  {task.endTime ? formatTimeAgo(task.endTime) : 'Running...'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
              {task.finding}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Evidence Anchors: </span>
                {task.evidenceRefs.length > 0 ? (
                  task.evidenceRefs.map((ref) => (
                    <span key={ref} className="code-tag" style={{ marginRight: '4px' }}>{ref}</span>
                  ))
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>None referenced</span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Missing: <em>{task.missingInfo}</em>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

