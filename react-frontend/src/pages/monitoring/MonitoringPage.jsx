/**
 * SupplyGuard Risk Monitoring & Alert Intake Page
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, Radio, Plus, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { getMonitoringData, simulateSignalIngestion } from '../../services/monitoring/monitoringService.js';
import { createCase } from '../../services/cases/caseService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { TrustBadge } from '../../components/common/TrustBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { formatTimeAgo, formatNumber } from '../../utils/formatters.js';

export function MonitoringPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showToast } = useToast();
  const { refreshWorkspace } = useWorkspace();
  const navigate = useNavigate();

  // Intake Form State
  const [formData, setFormData] = useState({
    title: '',
    disruptionType: 'Supplier Delay',
    risk: 'High',
    supplierName: '',
    shipmentRef: '',
    productName: '',
    sku: '',
    locationName: '',
    delayDays: 3,
    quantity: 5000,
    description: '',
  });

  useEffect(() => {
    async function loadMonitoring() {
      try {
        const res = await getMonitoringData();
        setData(res);
      } catch (err) {
        console.error('Failed to load monitoring data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMonitoring();
  }, []);

  const handleSimulateSignal = async () => {
    try {
      const newSig = await simulateSignalIngestion();
      const updated = await getMonitoringData();
      setData(updated);
      showToast(`Proactive telemetry signal ingested: ${newSig.id} (${newSig.entity})`, 'warning');
      refreshWorkspace();
    } catch (err) {
      showToast(`Simulation failed: ${err.message}`, 'error');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplierName || !formData.productName || !formData.description) {
      showToast('Please fill all required alert fields.', 'error');
      return;
    }

    try {
      const created = await createCase(formData);
      setIsReportModalOpen(false);
      showToast(`Alert reported: Case ${created.id} initialized with verification state: Unverified.`, 'success');
      refreshWorkspace();
      navigate(`/disruptions/${created.id}`);
    } catch (err) {
      showToast(`Submission failed: ${err.message}`, 'error');
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Connecting to proactive telemetry listeners..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
            Risk Monitoring & Disruption Intake
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Continuous telemetry observation against deterministic rules and manual operational alert reporting.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleSimulateSignal}
            className="btn btn-secondary btn-sm"
          >
            <Radio size={14} className="pulse-active" />
            <span>Simulate Proactive Signal</span>
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>Report a Disruption</span>
          </button>
        </div>
      </div>

      {/* 3 Telemetry Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Signal Telemetry Status
            </span>
            <span className="badge badge-demo">{data.mode}</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-teal)' }}>
            {data.systemStatus}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Listening across EDI 214, IoT sensor probes, and AIS marine streams
          </span>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Signals Evaluated Today
            </span>
            <TrustBadge state="verified" size="sm" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-navy)' }}>
            {formatNumber(data.signalsEvaluatedToday)}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Last cycle: {formatTimeAgo(data.lastEvaluation)}
          </span>
        </div>

        <div className="sg-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Active Detection Rules
            </span>
            <span className="badge badge-low">Operational</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-navy)' }}>
            {data.activeRules.length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Zero unhandled telemetry breaches
          </span>
        </div>
      </div>

      {/* Rules and Detected Signal Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Deterministic Rules */}
        <div className="sg-card">
          <div className="sg-card-header">
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>
                Deterministic Risk Rules
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Algorithmic threshold rules actively monitored 24/7
              </div>
            </div>
            <span className="badge badge-low">4 Rules Enforced</span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Rule ID & Name</th>
                  <th scope="col">Trigger Logic</th>
                  <th scope="col">Breaches</th>
                </tr>
              </thead>
              <tbody>
                {data.activeRules.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', fontSize: '13px' }}>
                        {rule.name}
                      </div>
                      <span className="code-tag">{rule.id}</span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {rule.condition}
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Scope: {rule.scope}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-high">{rule.triggeredCount} today</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detected Events */}
        <div className="sg-card">
          <div className="sg-card-header">
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>
                Recently Ingested Risk Signals
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {data.detectedEvents.length} telemetry alerts recorded
              </div>
            </div>
          </div>

          <div className="sg-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.detectedEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  borderBottom: '1px solid var(--color-border-subtle)',
                  paddingBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="code-tag font-bold">{evt.id}</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-navy)' }}>{evt.entity}</span>
                  </div>
                  <span style={{ color: 'var(--color-text-muted)' }}>{formatTimeAgo(evt.timestamp)}</span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        evt.severity === 'Critical'
                          ? '#FEF2F2'
                          : evt.severity === 'High'
                          ? '#FFF7ED'
                          : '#FEFCE8',
                      color:
                        evt.severity === 'Critical'
                          ? '#B91C1C'
                          : evt.severity === 'High'
                          ? '#C2410C'
                          : '#A16207',
                    }}
                  >
                    {evt.severity}
                  </span>

                  {evt.linkedCaseId ? (
                    <button
                      onClick={() => navigate(`/disruptions/${evt.linkedCaseId}`)}
                      className="btn btn-subtle btn-sm"
                      style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                    >
                      Inspect Case {evt.linkedCaseId} →
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Unlinked Signal</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Report a Disruption */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report an Operational Disruption"
        subtitle="Submit an alert to initiate a multi-agent investigation workspace"
        maxWidth="620px"
      >
        <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Trust notice */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <TrustBadge state="unverified" size="sm" />
            <span style={{ fontSize: '12px', color: '#92400E' }}>
              Data Integrity Notice: Manual alerts are marked Unverified until corroborated by carrier EDI or sensor telemetry.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Disruption Category *
              </label>
              <select
                value={formData.disruptionType}
                onChange={(e) => setFormData({ ...formData, disruptionType: e.target.value })}
                style={{ width: '100%' }}
                required
              >
                <option value="Supplier Delay">Supplier Inbound Delay</option>
                <option value="Transport Disruption">Transport / Carrier Strike</option>
                <option value="Warehouse Shutdown">Warehouse / Cold Storage Incident</option>
                <option value="Demand Spike">Unexpected Demand Surge</option>
                <option value="Port Congestion">Port Container Backlog</option>
                <option value="Other">Other Operational Risk</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Initial Severity Level *
              </label>
              <select
                value={formData.risk}
                onChange={(e) => setFormData({ ...formData, risk: e.target.value })}
                style={{ width: '100%' }}
                required
              >
                <option value="Critical">Critical (Immediate stockout hazard)</option>
                <option value="High">High (Depletion within 48h)</option>
                <option value="Medium">Medium (Manageable buffer)</option>
                <option value="Low">Low (Informational alert)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Supplier / Carrier Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Northstar Foods"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Shipment / PO Reference
              </label>
              <input
                type="text"
                placeholder="e.g. SHP-8821 or PO-9402"
                value={formData.shipmentRef}
                onChange={(e) => setFormData({ ...formData, shipmentRef: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Affected Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Cooking Oil 1L"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Impacted Location / DC *
              </label>
              <input
                type="text"
                placeholder="e.g. Metro Regional Depot"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Estimated Delay (Days) *
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.delayDays}
                onChange={(e) => setFormData({ ...formData, delayDays: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Delayed Quantity (Units)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
              Incident Description & Context *
            </label>
            <textarea
              rows={3}
              placeholder="Detail the event, root cause if reported, and current observations..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit & Initialize Case
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
