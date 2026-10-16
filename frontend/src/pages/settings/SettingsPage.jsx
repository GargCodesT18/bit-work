/**
 * SupplyGuard Operations Settings & Governance Console
 * Professional Enterprise Configuration & Baseline Management
 */
import React, { useState } from 'react';
import { ShieldCheck, Sliders, Database, RotateCcw, Check, BellRing } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export function SettingsPage() {
  const { resetDemoData } = useWorkspace();
  const { showToast } = useToast();

  const [safetyDays, setSafetyDays] = useState(4.0);
  const [criticalRunwayHours, setCriticalRunwayHours] = useState(24);
  const [ediLagHours, setEdiLagHours] = useState(24);
  const [autoTriageEnabled, setAutoTriageEnabled] = useState(true);
  const [strictPolicyEnforcement, setStrictPolicyEnforcement] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Operational thresholds and governance parameters updated successfully.', 'success');
  };

  const handleResetBaseline = async () => {
    try {
      await resetDemoData();
      showToast('Workspace reset: Canonical baseline scenario SC-2026-001 restored.', 'info');
    } catch (err) {
      showToast(`Reset failed: ${err.message}`, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '960px' }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-graphite, #66635f)', marginBottom: '6px' }}>
          07 · WORKSPACE GOVERNANCE & THRESHOLDS
        </div>
        <h1 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '32px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: 0 }}>
          Operations Policy & Governance Settings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-graphite, #66635f)', marginTop: '6px', lineHeight: 1.5 }}>
          Configure enterprise safety-stock mandates, deterministic telemetry rules, and baseline scenario parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Inventory & Safety Stock Policy */}
        <div className="sg-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="var(--color-bistre, #1a1614)" />
            <h2 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '20px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: 0 }}>
              Inventory Safety-Stock Mandates
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-graphite, #66635f)', marginBottom: '20px', lineHeight: 1.5 }}>
            Enforced by the Decision Reviewer agent. Transfers that reduce donor warehouse inventory below the mandate are blocked deterministically.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-bistre, #1a1614)', marginBottom: '6px' }}>
                Mandatory Safety Stock (Days)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="14"
                value={safetyDays}
                onChange={(e) => setSafetyDays(parseFloat(e.target.value) || 4.0)}
                style={{ width: '100%', height: '38px', borderRadius: '4px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-graphite, #66635f)', marginTop: '4px', display: 'block' }}>
                Corporate mandate: Minimum 4.0 days buffer.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-bistre, #1a1614)', marginBottom: '6px' }}>
                Critical Stockout Threshold (Hours)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                value={criticalRunwayHours}
                onChange={(e) => setCriticalRunwayHours(parseInt(e.target.value) || 24)}
                style={{ width: '100%', height: '38px', borderRadius: '4px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-graphite, #66635f)', marginTop: '4px', display: 'block' }}>
                Triggers immediate high-priority triage queue.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Telemetry Sensing Rules */}
        <div className="sg-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sliders size={18} color="var(--color-bistre, #1a1614)" />
            <h2 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '20px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: 0 }}>
              Telemetry & EDI Sensing Thresholds
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-graphite, #66635f)', marginBottom: '20px', lineHeight: 1.5 }}>
            Automated sensor listeners compare carrier EDI 214 status messages and warehouse telemetry against these thresholds.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-bistre, #1a1614)', marginBottom: '6px' }}>
                EDI Delivery Lag Alert Threshold (Hours)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                value={ediLagHours}
                onChange={(e) => setEdiLagHours(parseInt(e.target.value) || 24)}
                style={{ width: '100%', height: '38px', borderRadius: '4px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-graphite, #66635f)', marginTop: '4px', display: 'block' }}>
                RULE-02: Flags inbound POs when revised ETA exceeds PO by 24h.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-bistre, #1a1614)', marginBottom: '6px' }}>
                Data Freshness Expiry Window (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                defaultValue={4}
                style={{ width: '100%', height: '38px', borderRadius: '4px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-graphite, #66635f)', marginTop: '4px', display: 'block' }}>
                Telemetry older than 4h is marked as Stale Data.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Multi-Agent Governance Controls */}
        <div className="sg-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <BellRing size={18} color="var(--color-bistre, #1a1614)" />
            <h2 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '20px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: 0 }}>
              Specialist Agent Execution Governance
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-graphite, #66635f)', marginBottom: '20px', lineHeight: 1.5 }}>
            Control autonomous delegation and deterministic calculation parameters across the 5 agent roles.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-bistre, #1a1614)' }}>
              <input
                type="checkbox"
                checked={autoTriageEnabled}
                onChange={(e) => setAutoTriageEnabled(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>
                <strong>Auto-Triage Inbound Disruption Signals:</strong> Automatically dispatch Disruption Investigator agent upon receiving verified EDI 214 delay.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-bistre, #1a1614)' }}>
              <input
                type="checkbox"
                checked={strictPolicyEnforcement}
                onChange={(e) => setStrictPolicyEnforcement(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>
                <strong>Strict Human-in-the-Loop Sign-Off:</strong> Require explicit authenticated manager digital sign-off before executing inter-warehouse transfers.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
          <button type="submit" className="dark-pill-button">
            <Check size={14} />
            <span>Apply Governance Settings</span>
          </button>
        </div>
      </form>

      {/* 4. Scenario State Management */}
      <div className="sg-card" style={{ padding: '28px', borderTop: '2px solid var(--color-bistre, #1a1614)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RotateCcw size={18} color="var(--color-bistre, #1a1614)" />
          <h2 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '20px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: 0 }}>
            Demo Scenario State Management
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-graphite, #66635f)', marginBottom: '18px', lineHeight: 1.5 }}>
          Restore all active cases, telemetry signals, approval ledgers, and compliance audit entries to the canonical scenario baseline (Case <code>SC-2026-001</code>).
        </p>

        <button
          type="button"
          onClick={handleResetBaseline}
          className="ghost-outlined-button"
        >
          <RotateCcw size={14} />
          <span>Reset to Canonical Baseline State</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
