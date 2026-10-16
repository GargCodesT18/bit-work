/**
 * SupplyGuard Executive Operations Control Center Page
 * Industry-grade retail supply-chain disruption management console.
 * Incorporates control tower patterns from IBM Supply Chain Control Tower,
 * FourKites, Kinaxis RapidResponse, and project44.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Clock,
  Building2,
  Boxes,
  FileCheck,
  Truck,
  ExternalLink,
  Filter,
  Search,
  Zap,
  CheckCircle2,
  Activity,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { getCases } from '../../services/cases/caseService.js';
import { getAuditEvents } from '../../services/audit/auditService.js';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { MetricCard } from '../../components/common/MetricCard.jsx';
import { RiskBadge } from '../../components/common/RiskBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { TriggerBadge } from '../../components/common/TriggerBadge.jsx';
import { RunwayBar } from '../../components/common/RunwayBar.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { formatTimeAgo, formatCurrency, formatNumber } from '../../utils/formatters.js';

export function ControlCenterPage() {
  const { summary, loading, refreshAll } = useWorkspace();
  const [cases, setCases] = useState([]);
  const [recentAudit, setRecentAudit] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [casesData, auditData] = await Promise.all([
          getCases(),
          getAuditEvents(),
        ]);
        setCases(casesData);
        setRecentAudit(auditData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load control center data:', err);
      } finally {
        setLoadingCases(false);
      }
    }
    loadData();
  }, [summary]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    try {
      const [casesData, auditData] = await Promise.all([
        getCases(),
        getAuditEvents(),
      ]);
      setCases(casesData);
      setRecentAudit(auditData.slice(0, 6));
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Multi-Echelon Network Facility Profiles (Canonical Data Model)
  const networkNodes = useMemo(() => [
    {
      id: 'LOC-A',
      name: 'Central Distribution Center (DC A)',
      type: 'Primary Inbound Hub',
      location: 'Omaha, NE',
      onHand: 14000,
      dailyOutflow: 2000,
      coverageDays: 7.0,
      safetyMandateDays: 4.0,
      status: 'Healthy Buffer',
      roleDescription: 'Eligible Donor Node (+4,500 unit surplus)',
      isCritical: false,
      isDonor: true,
      skuTracked: 'Cooking Oil 1L (OIL-CAN-1L)',
      activeCaseId: 'SC-2026-001',
    },
    {
      id: 'LOC-B',
      name: 'Metro Regional Depot (Depot B)',
      type: 'Regional Fulfillment Depot',
      location: 'Chicago, IL',
      onHand: 1200,
      dailyOutflow: 1150,
      coverageDays: 1.04,
      safetyMandateDays: 4.0,
      status: 'Critical Stockout Hazard',
      roleDescription: 'Depletes in ~25 hours (-3,400 deficit)',
      isCritical: true,
      isDonor: false,
      skuTracked: 'Cooking Oil 1L (OIL-CAN-1L)',
      activeCaseId: 'SC-2026-001',
    },
    {
      id: 'LOC-PAC-04',
      name: 'Pacific Northwest Hub (WH-PAC-04)',
      type: 'Cold Chain Storage',
      location: 'Yakima, WA',
      onHand: 12000,
      dailyOutflow: 3000,
      coverageDays: 4.0,
      safetyMandateDays: 3.5,
      status: 'Quarantine / Spoilage Hazard',
      roleDescription: 'Chiller compressor trip (<3h salvage window)',
      isCritical: true,
      isDonor: false,
      skuTracked: 'Organic Whole Milk 2L',
      activeCaseId: 'SC-2026-002',
    },
    {
      id: 'LOC-EST-01',
      name: 'Eastern Distribution Center',
      type: 'Primary Inbound Hub',
      location: 'Allentown, PA',
      onHand: 18000,
      dailyOutflow: 2100,
      coverageDays: 8.5,
      safetyMandateDays: 4.0,
      status: 'Adequate Buffer',
      roleDescription: '6 Standby trucks held on contingency ($500)',
      isCritical: false,
      isDonor: true,
      skuTracked: 'Baking Flour 5kg',
      activeCaseId: 'SC-2026-003',
    },
  ], []);

  // Filter & Search Active Cases
  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (activeFilter === 'action') {
      result = result.filter(
        (c) => c.approval?.status === 'Pending Review' || c.approval?.status === 'Awaiting Approval'
      );
    } else if (activeFilter === 'critical') {
      result = result.filter((c) => c.risk === 'Critical' || c.risk === 'High');
    } else if (activeFilter === 'inflight') {
      result = result.filter((c) => c.status === 'In Progress' || c.outcome?.executionStatus === 'In Progress');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.supplier?.name.toLowerCase().includes(q) ||
          c.product?.name.toLowerCase().includes(q) ||
          c.disruptionType.toLowerCase().includes(q)
      );
    }

    return result;
  }, [cases, activeFilter, searchQuery]);

  if (loading || loadingCases) {
    return <LoadingSpinner message="Initializing Enterprise Supply-Chain Control Center..." />;
  }

  const dist = summary?.riskDistribution || { critical: 1, high: 1, medium: 2, low: 0 };
  const totalCases = (dist.critical + dist.high + dist.medium + dist.low) || 1;

  // Total calculated financial exposure across active disruptions
  const totalFinancialRisk = cases.reduce(
    (acc, c) => acc + (c.impactAssessment?.financialRiskExposure || 0),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Executive Operations Header & Live Telemetry Context */}
      <div
        className="sg-card"
        style={{
          padding: '24px 28px',
          backgroundColor: 'var(--color-bone, #fdfcfa)',
          borderLeft: '4px solid var(--color-bistre, #1a1614)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-bistre, #1a1614)',
                  backgroundColor: 'rgba(226, 230, 125, 0.3)',
                  border: '1px solid rgba(226, 230, 125, 0.6)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                Control Desk: FMCG & Ambient Grocery
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-teal)',
                    boxShadow: '0 0 0 2px rgba(22, 138, 122, 0.2)',
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 'var(--font-weight-medium)' }}>
                  Live Telemetry Active (EDI 214 • GPS IoT • WMS Sync)
                </span>
              </div>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-test-signifier, serif)',
                fontSize: '32px',
                fontWeight: 400,
                color: 'var(--color-bistre, #1a1614)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                margin: '4px 0 6px 0',
              }}
            >
              Supply-Chain Disruption Control Center
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-graphite, #66635f)',
                lineHeight: 1.5,
              }}
            >
              Authoritative decision-support for retail inventory runway, carrier delays, and human-in-the-loop recovery mitigation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="btn btn-secondary btn-sm"
              title="Poll latest EDI feeds and inventory counts"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>
            <button
              onClick={() => navigate('/monitoring')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Activity size={14} />
              <span>Sensing Rules</span>
            </button>
            <button
              onClick={() => navigate('/disruptions')}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Disruptions ({cases.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Operational Context Sub-Banner */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--color-critical)' }} />
              <strong>1 Regional Depot</strong> in Critical Stockout Runway (&lt; 25h)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} style={{ color: '#EA580C' }} />
              <strong>1 Cold Hub</strong> in Temperature Excursion Quarantine (&lt; 3h window)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck size={14} style={{ color: 'var(--color-primary)' }} />
              <strong>2 Recovery Actions</strong> Awaiting Operations Manager Sign-off
            </span>
          </div>

          <div className="font-mono text-xs text-muted">
            Safety Stock Policy: <strong>SEC-INV-2025</strong> (Min 4.0 Days Mandate)
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Tier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          label="Active Disruptions"
          value={summary?.activeDisruptions || 4}
          subtext="Across 3 critical retail categories"
          isDemo={true}
        />
        <MetricCard
          label="Critical Hazards"
          value={summary?.highRiskCases || 2}
          valueColor="var(--color-critical)"
          subtext="Runway &lt; 48 hours or spoilage"
          isDemo={true}
        />
        <MetricCard
          label="Financial Exposure"
          value={formatCurrency(totalFinancialRisk)}
          valueColor="var(--color-navy)"
          subtext="Lost sales & contractual penalties"
          isDemo={true}
        />
        <MetricCard
          label="Awaiting Approval"
          value={summary?.casesAwaitingApproval || 2}
          valueColor="var(--color-warning)"
          subtext="Pending human operations sign-off"
          isDemo={true}
        />
        <MetricCard
          label="In-Flight Recoveries"
          value="1"
          valueColor="var(--color-teal)"
          subtext="Contingency hold active (Rail)"
          isDemo={true}
        />
        <MetricCard
          label="Policy Compliance"
          value="100%"
          valueColor="var(--color-teal)"
          subtext="All options adhere to 4.0d safety mandate"
          isDemo={true}
        />
      </div>

      {/* 3. Operational "Needs Immediate Attention" Exception Queue (The Operations Desk Heartbeat) */}
      <div className="sg-card" style={{ border: '1px solid #FED7AA' }}>
        <div
          className="sg-card-header"
          style={{
            backgroundColor: '#FFFBEB',
            borderBottom: '1px solid #FED7AA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FEE2E2',
                color: 'var(--color-critical)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={16} />
            </span>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Operational Exception Triage Queue
                <span className="badge badge-critical" style={{ fontSize: '11px', padding: '1px 6px' }}>
                  2 Actions Require Human Sign-Off
                </span>
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Pre-computed multi-agent recovery proposals requiring operations manager review and authorization
              </div>
            </div>
          </div>
          <span className="font-mono text-xs text-muted">
            Queue Latency: 1.2s • Policy SEC-INV-2025 Enforced
          </span>
        </div>

        <div className="sg-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
          {/* Action 1: Northstar Foods Cooking Oil Inter-Warehouse Transfer */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface, #fdfcfa)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="code-tag font-bold" style={{ fontSize: '13px' }}>SC-2026-001</span>
                <RiskBadge risk="High" size="sm" />
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-navy)', fontSize: '14px' }}>
                  Northstar Foods Cooking Oil 1L — Metro Regional Depot (Depot B)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-critical font-mono" style={{ fontSize: '11px' }}>
                  Stockout in ~25 Hours (1.04d)
                </span>
                <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                  Pending Operations Sign-Off
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                fontSize: '12px',
                backgroundColor: 'var(--color-bg)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Root Cause Disruption:</span>
                <span style={{ color: 'var(--color-navy)', fontWeight: 'var(--font-weight-medium)' }}>
                  Carrier EDI 214 confirms 4-day port rail congestion delay (PO-9402).
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Financial Exposure:</span>
                <span style={{ color: 'var(--color-critical)', fontWeight: 'var(--font-weight-bold)' }}>
                  $20,366 penalty & lost margin (3,400 units shortfall)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Agent Recommended Mitigation:</span>
                <span style={{ color: 'var(--color-teal)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Option 1: Inter-Warehouse Transfer (3,500 units from DC A to Depot B)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Policy Validation:</span>
                <span style={{ color: 'var(--color-teal)', fontWeight: 'var(--font-weight-medium)' }}>
                  DC A retains 5.25d coverage (Policy SEC-INV-2025 min 4.0d satisfied)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Transfer Cost: <strong>$1,450</strong> (Apex Logistics 53ft curtain-side) • Eliminates <strong>92%</strong> of projected stockout.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => navigate('/disruptions/SC-2026-001')}
                  className="btn btn-secondary btn-sm"
                >
                  Case Investigation
                </button>
                <button
                  onClick={() => navigate('/disruptions/SC-2026-001')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Review Transfer Authorization</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Action 2: Cascade Creamery Cold Hub Reefer Trailer Mobilization */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface, #fdfcfa)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="code-tag font-bold" style={{ fontSize: '13px' }}>SC-2026-002</span>
                <RiskBadge risk="Critical" size="sm" />
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-navy)', fontSize: '14px' }}>
                  Chilled Dairy Hub Compressor Excursion — WH-PAC-04 (Yakima, WA)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-critical font-mono" style={{ fontSize: '11px' }}>
                  Spoilage Window: &lt; 3 Hours
                </span>
                <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                  Pending QA & Ops Sign-Off
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                fontSize: '12px',
                backgroundColor: 'var(--color-bg)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Root Cause Disruption:</span>
                <span style={{ color: 'var(--color-navy)', fontWeight: 'var(--font-weight-medium)' }}>
                  Station cooler compressor #2 failure; ambient temp breached 6.2°C.
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Financial Exposure:</span>
                <span style={{ color: 'var(--color-critical)', fontWeight: 'var(--font-weight-bold)' }}>
                  $58,680 write-off (12,000 cartons Organic Milk on quarantine hold)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Agent Recommended Mitigation:</span>
                <span style={{ color: 'var(--color-teal)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Option 1: Deploy 3 Mobile Reefer Trailers on site ($3,200 rental)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Resolution Impact:</span>
                <span style={{ color: 'var(--color-teal)', fontWeight: 'var(--font-weight-medium)' }}>
                  Averts 100% of product loss; preserves shelf life and customer fill rate.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Rental Cost: <strong>$3,200</strong> • Saves <strong>$55,480</strong> net inventory write-off.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => navigate('/disruptions/SC-2026-002')}
                  className="btn btn-secondary btn-sm"
                >
                  Sensor Telemetry
                </button>
                <button
                  onClick={() => navigate('/disruptions/SC-2026-002')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Review Emergency Deployment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Multi-Echelon Network & Facility Health Grid */}
      <div className="sg-card">
        <div className="sg-card-header">
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} style={{ color: 'var(--color-primary)' }} />
              Multi-Echelon Facility Stockout Runway & Buffer Status
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Live inventory run-rates and safety thresholds across primary distribution hubs and fulfillment depots
            </div>
          </div>
          <button onClick={() => navigate('/network')} className="btn btn-secondary btn-sm">
            Network View →
          </button>
        </div>

        <div className="sg-card-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {networkNodes.map((node) => {
              const isCrit = node.coverageDays <= 2.0 || node.isCritical;
              return (
                <div
                  key={node.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isCrit ? '#FECACA' : 'var(--color-border)'}`,
                    backgroundColor: isCrit ? '#FFFBFB' : 'var(--color-surface, #fdfcfa)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span className="code-tag font-bold" style={{ fontSize: '11px' }}>{node.id}</span>
                      <span
                        className={`badge ${isCrit ? 'badge-critical' : 'badge-low'}`}
                        style={{ fontSize: '11px' }}
                      >
                        {node.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '13px', color: 'var(--color-navy)', marginTop: '4px' }}>
                      {node.name}
                    </h4>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {node.location} • {node.type}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Stockout Runway:</span>
                      <span className="font-mono font-bold" style={{ color: isCrit ? 'var(--color-critical)' : 'var(--color-teal)' }}>
                        {typeof node.coverageDays === 'number' ? `${node.coverageDays.toFixed(1)} Days` : '—'}
                      </span>
                    </div>
                    <RunwayBar
                      days={node.coverageDays}
                      maxDays={8}
                      safetyStockDays={node.safetyMandateDays}
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '11px',
                      padding: '8px',
                      backgroundColor: 'var(--color-surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>On Hand:</span>
                      <span className="font-mono font-bold">{formatNumber(node.onHand)}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Burn Rate:</span>
                      <span className="font-mono">{formatNumber(node.dailyOutflow)} /day</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{node.roleDescription}</span>
                    {node.activeCaseId && (
                      <button
                        onClick={() => navigate(`/disruptions/${node.activeCaseId}`)}
                        className="btn btn-subtle btn-sm"
                        style={{ padding: '2px 6px', fontSize: '11px' }}
                      >
                        Triage →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Trend Chart & Differential Severity Tier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Disruption Trend Chart */}
        <div className="sg-card">
          <div className="sg-card-header">
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
                Disruption Incident Velocity & Resolution Trend
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Trailing 7 Days: Inbound Sensing Signals Detected vs Completed Mitigations
              </div>
            </div>
            <span className="badge" style={{ backgroundColor: 'var(--color-surface-subtle)', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
              Trailing 7 Days
            </span>
          </div>

          <div className="sg-card-body">
            <div style={{ height: '170px', width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Horizontal gridlines */}
                <line x1="30" y1="20" x2="490" y2="20" stroke="#EEF2F6" strokeDasharray="3 3" />
                <line x1="30" y1="65" x2="490" y2="65" stroke="#EEF2F6" strokeDasharray="3 3" />
                <line x1="30" y1="110" x2="490" y2="110" stroke="#EEF2F6" strokeDasharray="3 3" />
                <line x1="30" y1="145" x2="490" y2="145" stroke="#DFE5EE" />

                {/* Y-axis labels */}
                <text x="15" y="24" fontSize="10" fill="#94A3B8" fontFamily="var(--font-mono)">8</text>
                <text x="15" y="69" fontSize="10" fill="#94A3B8" fontFamily="var(--font-mono)">5</text>
                <text x="15" y="114" fontSize="10" fill="#94A3B8" fontFamily="var(--font-mono)">2</text>
                <text x="15" y="148" fontSize="10" fill="#94A3B8" fontFamily="var(--font-mono)">0</text>

                {/* Detected line (Primary Blue) */}
                <polyline
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="50,95 115,65 180,110 245,50 310,80 375,35 440,80"
                />

                {/* Resolved line (Teal dashed) */}
                <polyline
                  fill="none"
                  stroke="var(--color-teal)"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="50,110 115,80 180,95 245,95 310,65 375,80 440,110"
                />

                {/* Node dots */}
                {[
                  [50, 95], [115, 65], [180, 110], [245, 50], [310, 80], [375, 35], [440, 80]
                ].map(([x, y], idx) => (
                  <circle key={`det-${idx}`} cx={x} cy={y} r="3.5" fill="var(--color-surface, #fdfcfa)" stroke="var(--color-primary)" strokeWidth="2" />
                ))}

                {/* X labels */}
                <text x="40" y="158" fontSize="10" fill="#94A3B8">Oct 09</text>
                <text x="105" y="158" fontSize="10" fill="#94A3B8">Oct 10</text>
                <text x="170" y="158" fontSize="10" fill="#94A3B8">Oct 11</text>
                <text x="235" y="158" fontSize="10" fill="#94A3B8">Oct 12</text>
                <text x="300" y="158" fontSize="10" fill="#94A3B8">Oct 13</text>
                <text x="365" y="158" fontSize="10" fill="#94A3B8">Oct 14</text>
                <text x="430" y="158" fontSize="10" fill="#94A3B8">Oct 15</text>
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--color-primary)', display: 'inline-block' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Detected Signals (Avg: 4.4/day)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--color-teal)', display: 'inline-block' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Mitigated Recoveries (Avg: 3.3/day)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Differential Severity Breakdown */}
        <div className="sg-card">
          <div className="sg-card-header">
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} style={{ color: '#EA580C' }} />
                Differential Severity Distribution
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Tiered by stockout runway hours and contractual penalty exposure
              </div>
            </div>
          </div>

          <div className="sg-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Critical */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-critical)' }}>
                  Critical (Depletion &lt; 24h or Spoilage)
                </span>
                <span className="font-mono font-bold">{dist.critical} Case</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(dist.critical / totalCases) * 100}%`, height: '100%', backgroundColor: 'var(--color-critical)' }} />
              </div>
            </div>

            {/* High */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: '#EA580C' }}>
                  High (Depletion 24h - 48h)
                </span>
                <span className="font-mono font-bold">{dist.high} Case</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(dist.high / totalCases) * 100}%`, height: '100%', backgroundColor: '#EA580C' }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning)' }}>
                  Medium (Buffer &gt; 48h / Contingency Hold)
                </span>
                <span className="font-mono font-bold">{dist.medium} Cases</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(dist.medium / totalCases) * 100}%`, height: '100%', backgroundColor: 'var(--color-warning)' }} />
              </div>
            </div>

            {/* Low */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-teal)' }}>
                  Low (Informational / Stable)
                </span>
                <span className="font-mono font-bold">{dist.low} Cases</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(dist.low / totalCases) * 100}%`, height: '100%', backgroundColor: 'var(--color-teal)' }} />
              </div>
            </div>

            <div
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.4,
              }}
            >
              Risk tiers are deterministically derived by days of coverage versus safety mandate (4.0d) and potential financial penalty exposure.
            </div>
          </div>
        </div>
      </div>

      {/* 6. Active Disruption Cases Master Table with Search & Triage Filters */}
      <div className="sg-card">
        <div className="sg-card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Boxes size={16} style={{ color: 'var(--color-primary)' }} />
              Active Retail Disruption Cases
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Operational triage grid prioritized by stockout urgency, financial penalty exposure, and human approval status
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '200px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter cases, SKUs..."
                style={{
                  paddingLeft: '32px',
                  paddingRight: '8px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontSize: '12px',
                  width: '100%',
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setActiveFilter('all')}
                className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                All ({cases.length})
              </button>
              <button
                onClick={() => setActiveFilter('action')}
                className={`btn btn-sm ${activeFilter === 'action' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                Needs Action ({cases.filter((c) => c.approval?.status === 'Pending Review' || c.approval?.status === 'Awaiting Approval').length})
              </button>
              <button
                onClick={() => setActiveFilter('critical')}
                className={`btn btn-sm ${activeFilter === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                Critical / High ({cases.filter((c) => c.risk === 'Critical' || c.risk === 'High').length})
              </button>
            </div>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table" aria-label="Active Disruption Cases">
            <thead>
              <tr>
                <th scope="col">Case ID</th>
                <th scope="col">Incident Description</th>
                <th scope="col">Supplier & Shipment</th>
                <th scope="col">Impacted Product & Node</th>
                <th scope="col">Stockout Runway</th>
                <th scope="col">Financial Exposure</th>
                <th scope="col">Recommended Mitigation</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => {
                const primaryLoc = c.impactAssessment?.locations?.find((l) => (l.daysCoverage ?? l.coverageDays) <= 2.0) ||
                  c.impactAssessment?.locations?.[0];
                const days = typeof primaryLoc?.daysCoverage === 'number'
                  ? primaryLoc.daysCoverage
                  : typeof primaryLoc?.coverageDays === 'number'
                  ? primaryLoc.coverageDays
                  : null;
                const isCritRunway = typeof days === 'number' && days <= 2.0;
                const recommendedPlan = c.recoveryOptions?.find((o) => o.isRecommended) || c.recoveryOptions?.[0];

                return (
                  <tr
                    key={c.id}
                    className="row-interactive"
                    onClick={() => navigate(`/disruptions/${c.id}`)}
                  >
                    <td>
                      <span className="code-tag font-bold">{c.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-navy)', maxWidth: '240px' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {c.disruptionType}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{c.supplier?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {c.shipment?.poNumber} • {c.shipment?.carrier}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{c.product?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {primaryLoc?.name.split('(')[0].trim() || 'Multi-node'}
                      </div>
                    </td>
                    <td>
                      {primaryLoc && typeof days === 'number' ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              className="font-mono font-bold"
                              style={{
                                color: isCritRunway ? 'var(--color-critical)' : 'var(--color-teal)',
                                fontSize: '12px',
                              }}
                            >
                              {days.toFixed(1)}d
                            </span>
                            {primaryLoc.projectedStockoutHours && (
                              <span className="badge badge-critical" style={{ fontSize: '10px', padding: '0 4px' }}>
                                ~{primaryLoc.projectedStockoutHours}h
                              </span>
                            )}
                          </div>
                          <div style={{ width: '80px', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden', marginTop: '3px' }}>
                            <div
                              style={{
                                width: `${Math.min(100, Math.max(0, (days / 7) * 100))}%`,
                                height: '100%',
                                backgroundColor: isCritRunway ? 'var(--color-critical)' : 'var(--color-teal)',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div className="font-mono font-semibold" style={{ color: 'var(--color-navy)', fontSize: '12px' }}>
                        {formatCurrency(c.impactAssessment?.financialRiskExposure || 0)}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        {formatNumber(c.impactAssessment?.estimatedTotalShortage || 0)} units
                      </div>
                    </td>
                    <td>
                      {recommendedPlan ? (
                        <div style={{ maxWidth: '200px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-teal)' }}>
                            {recommendedPlan.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            Cost: {formatCurrency(recommendedPlan.estimatedCost)} • {recommendedPlan.leadTimeDisplay}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Analysis in progress</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <RiskBadge risk={c.risk} size="sm" />
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/disruptions/${c.id}`);
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>Investigate</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Multi-Agent Reasoning & Chronological Execution Stream */}
      <div className="sg-card">
        <div className="sg-card-header">
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--color-primary)' }} />
              Recent Multi-Agent Calculations & Human Authorization Trace
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Chronological log of sensing signals, impact calculations, policy validations, and operations manager decisions
            </div>
          </div>
          <button onClick={() => navigate('/audit')} className="btn btn-subtle btn-sm">
            Full Audit Log →
          </button>
        </div>

        <div className="sg-card-body" style={{ padding: '0' }}>
          {recentAudit.map((evt, idx) => (
            <div
              key={evt.id}
              style={{
                padding: '12px 20px',
                borderBottom: idx < recentAudit.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span className="code-tag font-bold" style={{ minWidth: '85px', textAlign: 'center', fontSize: '11px' }}>
                  {evt.caseId}
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      evt.actorType === 'Human'
                        ? '#EFF6FF'
                        : evt.actorType === 'Agent'
                        ? '#F5F3FF'
                        : '#FEF3C7',
                    color:
                      evt.actorType === 'Human'
                        ? '#1D4ED8'
                        : evt.actorType === 'Agent'
                        ? '#6D28D9'
                        : '#92400E',
                    fontSize: '11px',
                  }}
                >
                  {evt.actorType}: {evt.actorName}
                </span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  {evt.summary}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span className="font-mono text-xs text-muted">
                  {formatTimeAgo(evt.timestamp)}
                </span>
                <button
                  onClick={() => navigate(`/disruptions/${evt.caseId}`)}
                  className="btn btn-subtle btn-sm"
                  style={{ padding: '2px 6px', fontSize: '11px' }}
                  title="View Case"
                >
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
