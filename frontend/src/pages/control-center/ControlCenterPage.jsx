/**
 * SupplyGuard Executive Operations Control Center Page
 * Professional Antimetal Editorial & Glass Console
 * Zero saturated neon colors. Clean typography, spacious layout, authoritative triage.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { getCases } from '../../services/cases/caseService.js';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { MetricCard } from '../../components/common/MetricCard.jsx';
import { RiskBadge } from '../../components/common/RiskBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function ControlCenterPage() {
  const { summary, loading, refreshAll } = useWorkspace();
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const casesData = await getCases();
        setCases(casesData);
      } catch (err) {
        console.error('Failed to load control center cases:', err);
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
      const casesData = await getCases();
      setCases(casesData);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (filterType === 'action') {
      result = result.filter(
        (c) => c.approval?.status === 'Pending Review' || c.approval?.status === 'Awaiting Approval'
      );
    } else if (filterType === 'critical') {
      result = result.filter((c) => c.risk === 'Critical' || c.risk === 'High');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.supplier?.name.toLowerCase().includes(q) ||
          c.product?.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [cases, filterType, searchQuery]);

  if (loading || loadingCases) {
    return <LoadingSpinner message="Initializing Operations Control Center..." />;
  }

  const totalFinancialRisk = cases.reduce(
    (acc, c) => acc + (c.impactAssessment?.financialRiskExposure || 0),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* 1. Operations Header & Actions */}
      <div
        className="sg-card"
        style={{
          padding: '28px 32px',
          backgroundColor: 'var(--color-bone, #fdfcfa)',
          borderLeft: '4px solid var(--color-bistre, #1a1614)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
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
                backgroundColor: 'rgba(226, 230, 125, 0.35)',
                border: '1px solid rgba(226, 230, 125, 0.7)',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              Control Desk: FMCG & Ambient Grocery
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-chartreuse-whisper, #e2e67d)',
                  boxShadow: '0 0 0 2px rgba(26, 22, 20, 0.1)',
                }}
              />
              <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', color: 'var(--color-graphite, #66635f)' }}>
                Live Feeds Reconciled (EDI 214 • WMS Telemetry)
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
              margin: '0 0 4px 0',
            }}
          >
            Supply-Chain Operations Control Center
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-graphite, #66635f)', margin: 0 }}>
            Authoritative decision-support for retail inventory runway, carrier delays, and evidence-backed recovery authorizations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="ghost-outlined-button"
            style={{ padding: '9px 18px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
          <button
            onClick={() => navigate('/monitoring')}
            className="dark-pill-button"
            style={{ padding: '9px 20px', fontSize: '13px' }}
          >
            <span>Report Disruption</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Tier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          label="Active Disruptions"
          value={summary?.activeDisruptions || cases.length}
          subtext="Across monitored regional nodes"
          isDemo={false}
        />
        <MetricCard
          label="Critical Hazards"
          value={summary?.highRiskCases || 2}
          valueColor="#1a1614"
          subtext="Runway < 48h or spoilage risk"
          isDemo={false}
        />
        <MetricCard
          label="Financial Exposure"
          value={formatCurrency(totalFinancialRisk)}
          valueColor="#1a1614"
          subtext="Calculated lost margin & penalties"
          isDemo={false}
        />
        <MetricCard
          label="Awaiting Approval"
          value={summary?.casesAwaitingApproval || 2}
          valueColor="#1a1614"
          subtext="Pending operations sign-off"
          isDemo={false}
        />
      </div>

      {/* 3. Operational Analytics Grid (Velocity Trend & Severity Breakdown) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '20px',
        }}
      >
        {/* Left: Disruption Velocity Trend */}
        <div className="sg-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>
                TELEMETRY SIGNAL VELOCITY
              </div>
              <h3 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '18px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: '2px 0 0 0' }}>
                7-Day Inbound Sensing vs Resolved Mitigations
              </h3>
            </div>
            <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', color: 'var(--color-graphite, #66635f)' }}>
              Trailing 7 Days
            </span>
          </div>

          {/* Minimalist Editorial Line Chart */}
          <div style={{ width: '100%', height: '170px' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%' }}>
              {/* Hairline Grid */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(26,22,20,0.08)" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(26,22,20,0.08)" strokeDasharray="3 3" />
              <line x1="40" y1="110" x2="480" y2="110" stroke="rgba(26,22,20,0.08)" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(26,22,20,0.14)" />

              {/* Resolved line (Graphite dashed) */}
              <polyline
                fill="none"
                stroke="#66635f"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                points="50,110 115,80 180,95 245,95 310,65 375,80 440,110"
              />

              {/* Detected Signals line (Bistre solid) */}
              <polyline
                fill="none"
                stroke="#1a1614"
                strokeWidth="2"
                points="50,95 115,65 180,110 245,50 310,80 375,35 440,80"
              />

              {/* Nodes on Detected line */}
              {[
                [50, 95], [115, 65], [180, 110], [245, 50], [310, 80], [375, 35], [440, 80]
              ].map(([x, y], idx) => (
                <circle key={idx} cx={x} cy={y} r="3.5" fill="#fdfcfa" stroke="#1a1614" strokeWidth="2" />
              ))}

              {/* X-Axis Dates */}
              {['Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16'].map((d, i) => (
                <text key={d} x={50 + i * 65} y="154" fontSize="9.5" fontFamily="var(--font-geist-mono, monospace)" fill="#66635f" textAnchor="middle">
                  {d}
                </text>
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '11px', fontFamily: 'var(--font-geist-mono, monospace)', color: 'var(--color-graphite, #66635f)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: '#1a1614', display: 'inline-block' }} />
              Detected Signals (Avg 4.4/d)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: '#66635f', borderTop: '1px dashed #66635f', display: 'inline-block' }} />
              Mitigated Recoveries (Avg 3.3/d)
            </span>
          </div>
        </div>

        {/* Right: Severity Distribution (Antimetal Monochrome Bars) */}
        <div className="sg-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>
              INCIDENT EXPOSURE
            </div>
            <h3 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '18px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: '2px 0 0 0' }}>
              Severity by Stockout Runway
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Critical */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-bistre, #1a1614)' }}>Critical (&lt; 24h Runway / Spoilage)</span>
                <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontWeight: 600 }}>1 Case</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-quill, #e3e3de)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', backgroundColor: '#1a1614' }} />
              </div>
            </div>

            {/* High */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-graphite, #66635f)' }}>High (24h - 48h Runway)</span>
                <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontWeight: 600 }}>1 Case</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-quill, #e3e3de)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', backgroundColor: '#53504c' }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-graphite, #66635f)' }}>Medium (&gt; 48h Buffer / Contingency)</span>
                <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontWeight: 600 }}>2 Cases</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-quill, #e3e3de)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', backgroundColor: '#a8a7a1' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px dashed rgba(26,22,20,0.12)', fontSize: '11px', color: 'var(--color-graphite, #66635f)', lineHeight: 1.5 }}>
            Governed by Safety Mandate <strong>SEC-INV-2025</strong> (Minimum 4.0 Days baseline buffer).
          </div>
        </div>
      </div>

      {/* 4. Active Disruption Cases Table (Spacious, Clear, Non-Truncated) */}
      <div className="sg-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>
              OPERATIONS TRIAGE QUEUE
            </div>
            <h2 style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '20px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)', margin: '2px 0 0 0' }}>
              Active Retail Disruption Cases
            </h2>
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a8a7a1' }} />
              <input
                type="text"
                placeholder="Filter cases, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '32px',
                  width: '100%',
                  height: '34px',
                  fontSize: '12px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-cream, #f7f6f3)',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'dark-pill-button' : 'ghost-outlined-button'}
                style={{ padding: '5px 12px', fontSize: '12px' }}
              >
                All ({cases.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('action')}
                className={filterType === 'action' ? 'dark-pill-button' : 'ghost-outlined-button'}
                style={{ padding: '5px 12px', fontSize: '12px' }}
              >
                Needs Action
              </button>
              <button
                type="button"
                onClick={() => setFilterType('critical')}
                className={filterType === 'critical' ? 'dark-pill-button' : 'ghost-outlined-button'}
                style={{ padding: '5px 12px', fontSize: '12px' }}
              >
                High / Critical
              </button>
            </div>
          </div>
        </div>

        {/* Clean Disruption Cases Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '880px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(26,22,20,0.12)' }}>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>Case ID</th>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>Incident & Supplier</th>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>Affected Facility & SKU</th>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>Stockout Runway</th>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>Financial Exposure</th>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>Severity</th>
                <th style={{ padding: '12px 14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)', textAlign: 'right' }}>Workspace</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => {
                const runwayDays = c.impactAssessment?.receivingDepotRunwayDays;
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/disruptions/${c.id}`)}
                    style={{
                      borderBottom: '1px dashed rgba(26,22,20,0.1)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream, #f7f6f3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '12px', fontWeight: 600, color: 'var(--color-bistre, #1a1614)' }}>
                      {c.id}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-bistre, #1a1614)' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-graphite, #66635f)', marginTop: '2px' }}>
                        {c.supplier?.name || 'Primary Supplier'}
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--color-bistre, #1a1614)' }}>
                        {c.product?.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-graphite, #66635f)', marginTop: '2px' }}>
                        {c.location?.name}
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '13px', fontWeight: 600, color: runwayDays && runwayDays < 2.0 ? '#1a1614' : 'var(--color-graphite, #66635f)' }}>
                        {typeof runwayDays === 'number' ? `${runwayDays.toFixed(1)} Days` : 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '13px', color: 'var(--color-bistre, #1a1614)' }}>
                      {formatCurrency(c.impactAssessment?.financialRiskExposure || 0)}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <RiskBadge risk={c.risk} size="sm" />
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <span className="ghost-outlined-button" style={{ padding: '4px 10px', fontSize: '11px' }}>
                        <span>Triage</span>
                        <ArrowRight size={11} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ControlCenterPage;
