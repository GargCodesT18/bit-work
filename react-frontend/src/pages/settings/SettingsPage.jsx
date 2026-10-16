/**
 * SupplyGuard Settings & Simulation Configuration Page
 */
import React from 'react';
import { Settings, RotateCcw, Server, ShieldCheck, Database } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { isLiveBackendConfigured } from '../../services/api/client.js';

export function SettingsPage() {
  const { resetDemoData } = useWorkspace();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
          System & Simulation Settings
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Configure telemetry endpoints, verify corporate safety policy rules, and manage demo simulation state.
        </p>
      </div>

      {/* Backend Connection Status */}
      <div className="sg-card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Server size={20} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>
            Backend API Connection Boundary
          </h2>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
          SupplyGuard is architected with a strict service boundary. Components consume domain hooks and service layers, decoupled from backend persistence.
        </p>

        <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-navy)' }}>
              Operating Adapter Mode:
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: isLiveBackendConfigured ? '#ECFDF5' : '#FEF3C7',
                color: isLiveBackendConfigured ? '#047857' : '#92400E',
                fontWeight: 'bold',
              }}
            >
              {isLiveBackendConfigured ? 'Live Backend Connected' : 'Offline Mock Adapter (Active)'}
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Configured Endpoint (<code>VITE_API_BASE_URL</code>):{' '}
            <span className="font-mono" style={{ color: 'var(--color-navy)', fontWeight: 'bold' }}>
              {apiBaseUrl ? apiBaseUrl : 'None (Mock adapter active with localStorage persistence)'}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          To connect your teammate's backend, create a <code>.env.local</code> file in <code>react-frontend/</code> and define: <code>VITE_API_BASE_URL=http://localhost:5000/api</code>.
        </p>
      </div>

      {/* Corporate Safety Stock Policy */}
      <div className="sg-card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--color-teal)' }} />
          <h2 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>
            Enforced Corporate Safety Stock Policy
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>POLICY IDENTIFIER</div>
            <div className="font-mono font-bold" style={{ color: 'var(--color-navy)', marginTop: '2px' }}>SEC-INV-2025</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>MINIMUM COVERAGE MANDATE</div>
            <div className="font-mono font-bold" style={{ color: 'var(--color-teal)', marginTop: '2px' }}>4.0 Days of Stock</div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '12px', lineHeight: 1.5 }}>
          The Decision Reviewer agent enforces this rule deterministically: any proposed inter-warehouse transfer that would deplete the source distribution center below 4.0 days coverage is marked <strong>Not Feasible</strong>.
        </p>
      </div>

      {/* Demo Simulation Reset */}
      <div className="sg-card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RotateCcw size={20} style={{ color: 'var(--color-warning)' }} />
          <h2 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>
            Demo State Reset
          </h2>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Restore all disruption cases, telemetry signals, approval records, and audit events to the canonical demo baseline (including case <code>SC-2026-001</code>).
        </p>

        <button
          onClick={resetDemoData}
          className="btn btn-secondary"
          style={{ borderColor: '#FDE68A', color: '#92400E', backgroundColor: '#FEF3C7' }}
        >
          <RotateCcw size={15} />
          <span>Reset All Demo Data to Canonical Baseline</span>
        </button>
      </div>
    </div>
  );
}
