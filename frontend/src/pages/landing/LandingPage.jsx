/**
 * SupplyGuard Landing Page — Antimetal Style Editorial & Glass Interface
 * Connects the public product overview to the React Operations Workspace
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  Compass,
} from 'lucide-react';
import './LandingPage.css';

export function LandingPage() {
  const [activePreviewStage, setActivePreviewStage] = useState('stage-alert');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  const faqItems = [
    {
      q: 'How does SupplyGuard verify disruption signals before alerting operations?',
      a: 'SupplyGuard enforces a six-state data integrity model. Incoming telemetry from carrier EDI 214 status messages, port terminal EDI, and warehouse cycle counts is classified as a Verified Fact once reconciled. Signals lacking secondary corroboration are flagged as Unverified or Estimates to prevent premature overreaction.'
    },
    {
      q: 'Can the decision engine recommend transfers that deplete source warehouses?',
      a: 'No. The Decision Reviewer component deterministically checks corporate safety-stock mandates before presenting any recovery option. In our canonical scenario (SC-2026-001), moving 3,500 units leaves Central DC with 5.25 days of coverage, strictly honoring the mandatory 4.0-day safety stock buffer.'
    },
    {
      q: 'Does SupplyGuard require human approval to execute recovery actions?',
      a: 'Yes. SupplyGuard is designed as a human-in-the-loop decision-support workspace. High-impact mitigations (such as inter-warehouse transfers, spot freight charters, or supplier switches) require explicit digital authorization by an authorized operations manager, logged into an append-only audit trail.'
    },
    {
      q: 'How does SupplyGuard integrate with existing ERP and WMS infrastructure?',
      a: 'SupplyGuard provides a clean REST API facade. When configured with a live backend (via environment variables), it streams telemetry and syncs purchase orders. In offline or standalone demonstration mode, it persists states via browser storage for complete interactivity.'
    }
  ];

  return (
    <div className="landing-page" id="overview">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ====================================================================
          1. Liquid-Glass Navigation Capsule
          ==================================================================== */}
      <div className="nav-capsule-wrapper">
        <header className="liquid-nav-capsule" role="banner">
          <Link to="/" className="capsule-brand" aria-label="SupplyGuard Home">
            <div className="capsule-logo-icon">
              <ShieldAlert size={18} />
            </div>
            <span className="capsule-brand-title">SupplyGuard</span>
            <span className="capsule-badge">Ops Decision Engine</span>
          </Link>

          <nav aria-label="Main Navigation">
            <ul className="capsule-links">
              <li><a href="#overview" className="capsule-link">Overview</a></li>
              <li><a href="#challenges" className="capsule-link">Challenges</a></li>
              <li><a href="#workflow" className="capsule-link">Workflow</a></li>
              <li><a href="#agents" className="capsule-link">Agents</a></li>
              <li><a href="#capabilities" className="capsule-link">Capabilities</a></li>
              <li><a href="#faq" className="capsule-link">FAQ</a></li>
            </ul>
          </nav>

          <div className="capsule-actions">
            <Link to="/control-center" className="dark-pill-button">
              <span>Open Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>
      </div>

      <main id="main-content">
        {/* ====================================================================
            2. Hero Section: Editorial Headline + Animated Constellation
            ==================================================================== */}
        <section className="hero-editorial-section">
          <div className="hero-two-column-grid">
            <div className="hero-text-column">
              <div className="editorial-eyebrow">
                <span className="accent-dot"></span>
                <span>00 · Retail Operations Decision Engine</span>
              </div>
              <h1 className="hero-headline">
                Turn supply-chain disruptions into clear recovery decisions.
              </h1>
              <p className="hero-subtext">
                Identify affected products and locations, assess stockout risk, investigate recovery options, and give operations teams evidence-backed recommendations.
              </p>
              <div className="hero-button-pair">
                <Link to="/control-center" className="dark-pill-button">
                  <span>Open Operations Control Center</span>
                  <ArrowRight size={14} />
                </Link>
                <a href="#lifecycle-preview" className="ghost-outlined-button">
                  <span>Inspect Disruption Trace</span>
                </a>
              </div>
            </div>

            {/* Antimetal Signature Network Dandelion / Constellation Graphic */}
            <div className="hero-graphic-column" aria-hidden="true">
              <svg
                viewBox="0 0 400 400"
                className="constellation-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Subtle radiating hairline links (Flint at 0.4px) */}
                <g stroke="#a8a7a1" strokeWidth="0.5" strokeOpacity="0.45">
                  <line x1="200" y1="200" x2="80" y2="90" />
                  <line x1="200" y1="200" x2="130" y2="60" />
                  <line x1="200" y1="200" x2="200" y2="40" />
                  <line x1="200" y1="200" x2="270" y2="60" />
                  <line x1="200" y1="200" x2="320" y2="90" />
                  <line x1="200" y1="200" x2="350" y2="150" />
                  <line x1="200" y1="200" x2="360" y2="220" />
                  <line x1="200" y1="200" x2="330" y2="290" />
                  <line x1="200" y1="200" x2="280" y2="340" />
                  <line x1="200" y1="200" x2="200" y2="360" />
                  <line x1="200" y1="200" x2="120" y2="340" />
                  <line x1="200" y1="200" x2="70" y2="290" />
                  <line x1="200" y1="200" x2="40" y2="220" />
                  <line x1="200" y1="200" x2="50" y2="150" />

                  {/* Secondary internal constellation rays */}
                  <line x1="200" y1="200" x2="140" y2="130" />
                  <line x1="200" y1="200" x2="260" y2="130" />
                  <line x1="200" y1="200" x2="260" y2="270" />
                  <line x1="200" y1="200" x2="140" y2="270" />
                  <line x1="140" y1="130" x2="80" y2="90" />
                  <line x1="260" y1="130" x2="320" y2="90" />
                  <line x1="260" y1="270" x2="330" y2="290" />
                  <line x1="140" y1="270" x2="70" y2="290" />
                  <line x1="140" y1="130" x2="200" y2="40" />
                  <line x1="260" y1="130" x2="200" y2="40" />
                  <line x1="260" y1="270" x2="200" y2="360" />
                  <line x1="140" y1="270" x2="200" y2="360" />
                </g>

                {/* Outer Orbit Nodes (Bistre, Chartreuse, Warm Orange, Olive) */}
                <circle cx="80" cy="90" r="5" fill="#1a1614" />
                <circle cx="130" cy="60" r="4" fill="#e2e67d" />
                <circle cx="200" cy="40" r="5.5" fill="#f59e3a" />
                <circle cx="270" cy="60" r="4" fill="#9a9d3e" />
                <circle cx="320" cy="90" r="5" fill="#1a1614" />
                <circle cx="350" cy="150" r="4.5" fill="#e2e67d" />
                <circle cx="360" cy="220" r="5" fill="#1a1614" />
                <circle cx="330" cy="290" r="4.5" fill="#f59e3a" />
                <circle cx="280" cy="340" r="5" fill="#9a9d3e" />
                <circle cx="200" cy="360" r="6" fill="#1a1614" />
                <circle cx="120" cy="340" r="4.5" fill="#e2e67d" />
                <circle cx="70" cy="290" r="5" fill="#1a1614" />
                <circle cx="40" cy="220" r="4" fill="#f59e3a" />
                <circle cx="50" cy="150" r="5.5" fill="#9a9d3e" />

                {/* Mid-tier routing hubs */}
                <circle cx="140" cy="130" r="6.5" fill="#1a1614" />
                <circle cx="260" cy="130" r="6.5" fill="#1a1614" />
                <circle cx="260" cy="270" r="6.5" fill="#1a1614" />
                <circle cx="140" cy="270" r="6.5" fill="#1a1614" />

                {/* Chartreuse indicator badges */}
                <circle cx="140" cy="130" r="2.5" fill="#e2e67d" />
                <circle cx="260" cy="130" r="2.5" fill="#e2e67d" />
                <circle cx="260" cy="270" r="2.5" fill="#e2e67d" />
                <circle cx="140" cy="270" r="2.5" fill="#e2e67d" />

                {/* Center Core Node (Pulse) */}
                <circle
                  cx="200"
                  cy="200"
                  r="16"
                  fill="#1a1614"
                  className="constellation-pulse-center"
                />
                <circle cx="200" cy="200" r="6" fill="#e2e67d" />
              </svg>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. Interactive UI Preview: Case SC-2026-001 Lifecycle Trace
            ==================================================================== */}
        <section className="editorial-section cream-bg" id="lifecycle-preview">
          <div className="section-container">
            <div className="section-header-split">
              <div>
                <div className="editorial-eyebrow">
                  <span className="accent-dot"></span>
                  <span>01 · Interactive Lifecycle Trace</span>
                </div>
                <h2 className="section-heading-serif">
                  Deterministic triage in three decisive stages.
                </h2>
              </div>
              <p className="section-descriptor-text">
                Follow canonical scenario <strong>SC-2026-001</strong> from initial proactive carrier EDI signal ingestion to runway calculation and final operational transfer approval.
              </p>
            </div>

            <div className="interactive-preview-card">
              <div className="preview-capsule-bar">
                <div className="preview-bar-title">
                  <span className="preview-badge-pill">Canonical Scenario</span>
                  <span>Case SC-2026-001 • Pacific Swift Delay</span>
                </div>
                <div className="preview-stage-buttons">
                  <button
                    type="button"
                    className={`stage-switch-btn ${activePreviewStage === 'stage-alert' ? 'active' : ''}`}
                    onClick={() => setActivePreviewStage('stage-alert')}
                  >
                    1. Disruption Signal
                  </button>
                  <button
                    type="button"
                    className={`stage-switch-btn ${activePreviewStage === 'stage-impact' ? 'active' : ''}`}
                    onClick={() => setActivePreviewStage('stage-impact')}
                  >
                    2. Impact Runway
                  </button>
                  <button
                    type="button"
                    className={`stage-switch-btn ${activePreviewStage === 'stage-recovery' ? 'active' : ''}`}
                    onClick={() => setActivePreviewStage('stage-recovery')}
                  >
                    3. Recovery Decision
                  </button>
                </div>
              </div>

              <div className="preview-card-interior">
                {activePreviewStage === 'stage-alert' && (
                  <div className="stage-detail-box">
                    <div className="stage-header-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="editorial-badge critical">High Risk</span>
                        <span className="editorial-badge">Proactive Signal</span>
                        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '12px', fontWeight: 600 }}>
                          SC-2026-001
                        </span>
                      </div>
                      <span className="editorial-badge chartreuse">Verified Carrier EDI</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-test-signifier)', fontSize: '20px', fontWeight: 400, color: 'var(--color-bistre)', marginBottom: '8px' }}>
                      Northstar Foods: Inbound Shipment Delayed 4 Days
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-graphite)', marginBottom: '16px' }}>
                      Pacific Swift Intermodal revised ETA for 8,000 units of 1L Cooking Oil to Oct 20 due to terminal rail congestion.
                    </p>

                    <div className="preview-metric-grid">
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Affected Product</div>
                        <div className="preview-cell-value">Cooking Oil, 1 L (OIL-CAN-1L)</div>
                      </div>
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Primary Supplier</div>
                        <div className="preview-cell-value">Northstar Foods (SUP-101)</div>
                      </div>
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Trigger Rule</div>
                        <div className="preview-cell-value">RULE-02: EDI Lag &gt; 24h</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewStage === 'stage-impact' && (
                  <div className="stage-detail-box">
                    <div className="stage-header-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-test-signifier)', fontSize: '18px', fontWeight: 400 }}>
                          Differential Stock Depletion Runway
                        </span>
                        <span className="editorial-badge chartreuse">Deterministic Model</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-graphite)', fontFamily: 'var(--font-geist-mono)' }}>
                        Freshness: 12m ago
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                      <div style={{ backgroundColor: 'var(--color-cream)', padding: '16px', borderRadius: '4px', border: '1px solid rgba(26,22,20,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>Central DC (Location A)</span>
                          <span className="editorial-badge">Healthy Buffer</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-graphite)', marginBottom: '8px' }}>
                          Available: 14,000 units | Demand: 2,000/day
                        </div>
                        <div style={{ fontFamily: 'var(--font-test-signifier)', fontSize: '24px', color: 'var(--color-bistre)' }}>
                          7.0 Days Coverage
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--color-bone)', padding: '16px', borderRadius: '4px', border: '1px solid var(--color-bistre)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 500, fontSize: '13px', color: 'var(--color-bistre)' }}>Metro Regional Depot (Location B)</span>
                          <span className="editorial-badge" style={{ backgroundColor: 'var(--color-bistre)', color: 'var(--color-cream)', borderRadius: '9999px', padding: '2px 8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Imminent Stockout</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-graphite)', marginBottom: '8px' }}>
                          Available: 1,200 units | Demand: 1,150/day
                        </div>
                        <div style={{ fontFamily: 'var(--font-test-signifier)', fontSize: '24px', color: 'var(--color-bistre)' }}>
                          1.04 Days (25 Hours)
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--color-graphite)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="editorial-badge">Data Trust Policy</span>
                      <span>Runway projections assume steady run-rate consumption and zero transit attrition.</span>
                    </div>
                  </div>
                )}

                {activePreviewStage === 'stage-recovery' && (
                  <div className="stage-detail-box">
                    <div className="stage-header-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18} color="#168A7A" />
                        <span style={{ fontFamily: 'var(--font-test-signifier)', fontSize: '18px', fontWeight: 400, color: 'var(--color-bistre)' }}>
                          Recommended: Inter-Warehouse Transfer
                        </span>
                      </div>
                      <span className="editorial-badge">Awaiting Authorization</span>
                    </div>

                    <div className="preview-metric-grid" style={{ marginBottom: '16px' }}>
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Transfer Volume</div>
                        <div className="preview-cell-value">3,500 Units (DC A → Depot B)</div>
                      </div>
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Transit Lead Time</div>
                        <div className="preview-cell-value">18 Hours (Arrives in time)</div>
                      </div>
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Estimated Cost</div>
                        <div className="preview-cell-value">$1,450 (Saves $5,350 vs Air)</div>
                      </div>
                      <div className="preview-metric-cell">
                        <div className="preview-cell-label">Shortage Mitigated</div>
                        <div className="preview-cell-value" style={{ color: '#168A7A' }}>92% Coverage Buffer</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(26,22,20,0.12)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-graphite)' }}>
                        Verified: Central DC retains 5.25 days coverage (strictly above 4.0d safety mandate).
                      </span>
                      <Link to="/disruptions/SC-2026-001" className="dark-pill-button" style={{ padding: '8px 18px', fontSize: '13px' }}>
                        <span>Inspect Full Case in Workspace</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. The Retail Operational Challenge (Section 02)
            ==================================================================== */}
        <section className="editorial-section bone-bg" id="challenges">
          <div className="section-container">
            <div className="section-header-split">
              <div>
                <div className="editorial-eyebrow">
                  <span className="accent-dot"></span>
                  <span>02 · The Retail Operational Challenge</span>
                </div>
                <h2 className="section-heading-serif">
                  A shipment delay is more than a logistics problem.
                </h2>
              </div>
              <p className="section-descriptor-text">
                Retail supply chains operate across hundreds of distribution hubs and regional stores. When disruptions hit, disconnected systems slow response times.
              </p>
            </div>

            <div className="problem-card-grid">
              <div className="editorial-card">
                <div className="card-num-marker">01 / VISIBILITY</div>
                <h3 className="card-title-serif">Limited network visibility</h3>
                <p className="card-body-text">
                  Inbound delays from primary carriers do not automatically translate to downstream depot stockout calculations. Disconnected spreadsheets cause delayed escalation.
                </p>
              </div>

              <div className="editorial-card">
                <div className="card-num-marker">02 / UNCERTAINTY</div>
                <h3 className="card-title-serif">Uncertain stockout timelines</h3>
                <p className="card-body-text">
                  Varied local sales velocities across regional depots make it difficult to forecast which facility runs empty first and whether stockouts can be averted.
                </p>
              </div>

              <div className="editorial-card">
                <div className="card-num-marker">03 / TRADEOFFS</div>
                <h3 className="card-title-serif">Complex recovery evaluation</h3>
                <p className="card-body-text">
                  Evaluating inter-warehouse balancing versus expedited air freight charters requires balancing transit speeds, freight budgets, and corporate safety-stock policies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. Standardized Workflow (Section 03)
            ==================================================================== */}
        <section className="editorial-section cream-bg" id="workflow">
          <div className="section-container">
            <div className="section-header-split">
              <div>
                <div className="editorial-eyebrow">
                  <span className="accent-dot"></span>
                  <span>03 · Standardized Disruption Workflow</span>
                </div>
                <h2 className="section-heading-serif">
                  From signal detection to auditable resolution.
                </h2>
              </div>
              <p className="section-descriptor-text">
                A five-phase deterministic lifecycle ensuring every decision is justified by evidence and verified against inventory policies.
              </p>
            </div>

            <div className="workflow-steps-grid">
              <div className="workflow-step-card">
                <div className="workflow-step-index">1</div>
                <h3 className="workflow-step-title">Detect & Ingest</h3>
                <p className="workflow-step-desc">
                  Continuously listen for carrier EDI 214 revisions, port dwell spikes, or ingest manual reports from field warehouse managers.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="workflow-step-index">2</div>
                <h3 className="workflow-step-title">Investigate</h3>
                <p className="workflow-step-desc">
                  Extract telemetry, reconcile conflicting carrier messages, check warehouse cycle counts, and establish verified facts.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="workflow-step-index">3</div>
                <h3 className="workflow-step-title">Assess Impact</h3>
                <p className="workflow-step-desc">
                  Calculate days of coverage across receiving depots and quantify projected empty-shelf duration and financial exposure.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="workflow-step-index">4</div>
                <h3 className="workflow-step-title">Formulate Plans</h3>
                <p className="workflow-step-desc">
                  Generate and rank options across transfer lead time, cost delta, shortage mitigation ratio, and safety constraints.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="workflow-step-index">5</div>
                <h3 className="workflow-step-title">Authorize & Audit</h3>
                <p className="workflow-step-desc">
                  Provide human operators with explicit sign-off controls, append to the compliance ledger, and track post-approval milestones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            6. Specialized Multi-Agent Roles (Section 04)
            ==================================================================== */}
        <section className="editorial-section bone-bg" id="agents">
          <div className="section-container">
            <div className="section-header-split">
              <div>
                <div className="editorial-eyebrow">
                  <span className="accent-dot"></span>
                  <span>04 · Specialized Multi-Agent Roles</span>
                </div>
                <h2 className="section-heading-serif">
                  Modular specialist agents with deterministic boundaries.
                </h2>
              </div>
              <p className="section-descriptor-text">
                Instead of an unconstrained conversational chatbot, SupplyGuard deploys specialized components with clear operational responsibilities.
              </p>
            </div>

            <div className="agents-grid-layout">
              <div className="agent-role-card">
                <div className="agent-card-header">
                  <div className="agent-glyph-box">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="agent-title-text">Coordinator</h3>
                    <span className="agent-scope-label">Lifecycle & Orchestration</span>
                  </div>
                </div>
                <p className="agent-description">
                  Manages the incident workspace, coordinates specialist agents, delegates investigative steps, and updates overall case progress.
                </p>
              </div>

              <div className="agent-role-card">
                <div className="agent-card-header">
                  <div className="agent-glyph-box">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="agent-title-text">Disruption Investigator</h3>
                    <span className="agent-scope-label">Fact Extraction & Signals</span>
                  </div>
                </div>
                <p className="agent-description">
                  Reconciles contradictory carrier telemetry, monitors EDI feeds, catalogs verified evidence, and identifies data freshness anomalies.
                </p>
              </div>

              <div className="agent-role-card">
                <div className="agent-card-header">
                  <div className="agent-glyph-box">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <h3 className="agent-title-text">Impact Assessor</h3>
                    <span className="agent-scope-label">Runway Modeling</span>
                  </div>
                </div>
                <p className="agent-description">
                  Models inventory burn rates across distribution nodes, calculates stockout hours, and forecasts margin exposure under baseline conditions.
                </p>
              </div>

              <div className="agent-role-card">
                <div className="agent-card-header">
                  <div className="agent-glyph-box">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h3 className="agent-title-text">Recovery Planner</h3>
                    <span className="agent-scope-label">Alternative Formulation</span>
                  </div>
                </div>
                <p className="agent-description">
                  Formulates and scores viable recovery paths: inter-warehouse stock transfer, expedited air charters, backup suppliers, or passive monitoring.
                </p>
              </div>

              <div className="agent-role-card">
                <div className="agent-card-header">
                  <div className="agent-glyph-box">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h3 className="agent-title-text">Decision Reviewer</h3>
                    <span className="agent-scope-label">Constraint & Policy Check</span>
                  </div>
                </div>
                <p className="agent-description">
                  Validates recommended plans against safety-stock minimums (e.g. 4.0 days), highlights financial trade-offs, and packages the authorization brief.
                </p>
              </div>

              <div className="agent-role-card" style={{ backgroundColor: 'var(--color-cream)' }}>
                <div className="agent-card-header">
                  <div className="agent-glyph-box">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 className="agent-title-text">Deterministic Engine</h3>
                    <span className="agent-scope-label">Mathematical Core</span>
                  </div>
                </div>
                <p className="agent-description">
                  All runway days, lead-time checks, and budget deltas are calculated deterministically rather than generated probabilistically.
                </p>
              </div>
            </div>

            <div className="deterministic-banner">
              <ShieldAlert size={22} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-bistre)' }} />
              <div>
                <strong>Deterministic Business Rule Guarantees:</strong> Core mathematical operations (runway calculation, safety-stock rule checks, cost-benefit matrices) are executed by deterministic, testable code rather than stochastic generative text.
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            7. Operational Capabilities (Section 05)
            ==================================================================== */}
        <section className="editorial-section cream-bg" id="capabilities">
          <div className="section-container">
            <div className="section-header-split">
              <div>
                <div className="editorial-eyebrow">
                  <span className="accent-dot"></span>
                  <span>05 · Operational Capabilities</span>
                </div>
                <h2 className="section-heading-serif">
                  Engineered for reliable supply-chain control.
                </h2>
              </div>
              <p className="section-descriptor-text">
                Equip your operations desk with high-fidelity decision tools built to maintain shelf availability and optimize freight expenditure.
              </p>
            </div>

            <div className="capabilities-grid-layout">
              <div className="capability-card">
                <div className="capability-icon-pill">
                  <Clock size={20} />
                </div>
                <div className="capability-content">
                  <h3>Earlier Visibility into Depletion</h3>
                  <p>
                    Forecast stockout risks days before a depot runs dry by correlating real-time demand rates with updated carrier delivery milestones.
                  </p>
                </div>
              </div>

              <div className="capability-card">
                <div className="capability-icon-pill">
                  <Search size={20} />
                </div>
                <div className="capability-content">
                  <h3>Six-State Evidence Ledger</h3>
                  <p>
                    Clearly classify evidence into Verified Facts, Estimates, Assumptions, Unknowns, Stale Records, and Conflicts to avoid bad decisions.
                  </p>
                </div>
              </div>

              <div className="capability-card">
                <div className="capability-icon-pill">
                  <BarChart3 size={20} />
                </div>
                <div className="capability-content">
                  <h3>Side-by-Side Trade-off Matrices</h3>
                  <p>
                    Compare recovery options across speed, freight costs, shelf availability preservation, and corporate safety-stock policy compliance.
                  </p>
                </div>
              </div>

              <div className="capability-card">
                <div className="capability-icon-pill">
                  <CheckCircle2 size={20} />
                </div>
                <div className="capability-content">
                  <h3>Traceable Human Authorization</h3>
                  <p>
                    Ensure every recovery deployment has verified manager sign-off, accompanied by an append-only compliance audit trail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            8. Frequently Asked Questions (Section 06 — From DESIGN.md)
            ==================================================================== */}
        <section className="editorial-section bone-bg" id="faq">
          <div className="section-container">
            <div className="section-header-split">
              <div>
                <div className="editorial-eyebrow">
                  <span className="accent-dot"></span>
                  <span>06 · FAQ</span>
                </div>
                <h2 className="section-heading-serif">
                  Frequently asked questions.
                </h2>
              </div>
              <p className="section-descriptor-text">
                Key operational architecture, safety stock compliance, and deployment considerations for retail operations teams.
              </p>
            </div>

            <div className="faq-accordion-list">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="faq-accordion-row">
                    <button
                      type="button"
                      className="faq-question-button"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-icon-toggle">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-box">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================================
            9. Final CTA Section
            ==================================================================== */}
        <section className="final-cta-section">
          <div className="final-cta-container">
            <h2 className="final-cta-title">
              See the disruption workflow in action.
            </h2>
            <p className="final-cta-subtext">
              Access the operations control center, explore live mock disruption scenarios, inspect evidence ledgers, and simulate recovery plan approvals.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/control-center" className="dark-pill-button">
                <span>Open Operations Dashboard</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/disruptions" className="ghost-outlined-button">
                <span>View All Cases</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          10. Editorial Site Footer
          ==================================================================== */}
      <footer className="editorial-footer">
        <div className="footer-inner-flex">
          <div className="footer-brand-label">
            <ShieldAlert size={16} />
            <span>SupplyGuard</span>
          </div>

          <div className="footer-subnote">
            Retail Operations Control Center • Decision Support Engine
          </div>

          <ul className="footer-nav-list">
            <li className="footer-nav-item"><Link to="/control-center">Control Center</Link></li>
            <li className="footer-nav-item"><Link to="/disruptions">Disruptions</Link></li>
            <li className="footer-nav-item"><Link to="/monitoring">Risk Monitoring</Link></li>
            <li className="footer-nav-item"><Link to="/recovery">Recovery</Link></li>
            <li className="footer-nav-item"><Link to="/audit">Audit Log</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

