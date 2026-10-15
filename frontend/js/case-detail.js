/**
 * SupplyGuard Case Detail / Investigation Workspace Controller
 * The core decision-support view: Summary, Impact, Evidence, Agent Trace,
 * Recovery Options Comparison, Human Approval, and Outcome Tracking.
 */

const CaseDetailController = {
  activeTab: 'tab-summary',
  currentCase: null,
  selectedOptionId: null,

  async render(caseId) {
    const container = document.getElementById('case-detail-container');
    if (!container) return;

    try {
      this.currentCase = await apiService.getCaseById(caseId);
      this.selectedOptionId = this.currentCase.recommendation?.recommendedOptionId || this.currentCase.recoveryOptions[0]?.id;

      container.innerHTML = `
        <!-- Workspace Header -->
        <div class="case-workspace-header">
          <div class="case-header-top">
            <div class="case-id-badges">
              <span class="code-tag font-bold" style="font-size:0.875rem;">${this.currentCase.id}</span>
              ${App.renderRiskBadge(this.currentCase.risk)}
              ${App.renderStatusBadge(this.currentCase.status)}
              ${App.renderTriggerBadge(this.currentCase.triggerSource)}
              <span class="badge badge-demo">Demo Mode</span>
            </div>

            <div class="case-actions-bar">
              <button class="btn btn-secondary btn-sm" id="btn-refresh-case" title="Re-evaluate deterministic stock runway calculations">
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/></svg>
                <span>Refresh Assessment</span>
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-request-investigation" title="Instruct multi-agent specialists to collect more facts">
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                <span>Request More Investigation</span>
              </button>
              <button class="btn btn-subtle btn-sm" id="btn-back-to-cases">
                ← Back to Cases
              </button>
            </div>
          </div>

          <h1 class="case-title-large">${this.currentCase.title}</h1>

          <div class="case-meta-row">
            <div><strong>Disruption Type:</strong> ${this.currentCase.disruptionType}</div>
            <div><strong>Supplier:</strong> ${this.currentCase.supplier.name} (${this.currentCase.supplier.tier})</div>
            <div><strong>Created:</strong> ${App.formatDateTime(this.currentCase.createdAt)}</div>
            <div><strong>Last Updated:</strong> ${App.formatTimeAgo(this.currentCase.updatedAt)}</div>
          </div>
        </div>

        <!-- 7-Tab Navigation Bar -->
        <nav class="case-tabs-nav" role="tablist" aria-label="Investigation Workspace Sections">
          <button class="tab-btn ${this.activeTab === 'tab-summary' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-summary'}" data-tab="tab-summary" id="tab-btn-summary">
            A. Incident Summary
          </button>
          <button class="tab-btn ${this.activeTab === 'tab-impact' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-impact'}" data-tab="tab-impact" id="tab-btn-impact">
            B. Impact Assessment
          </button>
          <button class="tab-btn ${this.activeTab === 'tab-evidence' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-evidence'}" data-tab="tab-evidence" id="tab-btn-evidence">
            C. Evidence Ledger
            <span class="badge" style="background:var(--color-surface-subtle);">${this.currentCase.evidence.length}</span>
          </button>
          <button class="tab-btn ${this.activeTab === 'tab-agents' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-agents'}" data-tab="tab-agents" id="tab-btn-agents">
            D. Agent Task Trace
            <span class="badge" style="background:var(--color-surface-subtle);">${this.currentCase.agentTasks.length}</span>
          </button>
          <button class="tab-btn ${this.activeTab === 'tab-recovery' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-recovery'}" data-tab="tab-recovery" id="tab-btn-recovery">
            E. Recovery Options (${this.currentCase.recoveryOptions.length})
          </button>
          <button class="tab-btn ${this.activeTab === 'tab-approval' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-approval'}" data-tab="tab-approval" id="tab-btn-approval">
            F. Recommendation & Approval
            ${this.currentCase.approval?.status === 'Approved' ? '<span class="badge badge-low">Approved</span>' : '<span class="badge badge-medium">Action Needed</span>'}
          </button>
          <button class="tab-btn ${this.activeTab === 'tab-outcome' ? 'active' : ''}" role="tab" aria-selected="${this.activeTab === 'tab-outcome'}" data-tab="tab-outcome" id="tab-btn-outcome">
            G. Outcome Tracking
          </button>
        </nav>

        <!-- Tab Content Panes -->
        <div class="case-tabs-container">
          <div class="tab-panel ${this.activeTab === 'tab-summary' ? 'active' : ''}" id="tab-summary" role="tabpanel" aria-labelledby="tab-btn-summary">
            ${this.renderSummaryTab()}
          </div>

          <div class="tab-panel ${this.activeTab === 'tab-impact' ? 'active' : ''}" id="tab-impact" role="tabpanel" aria-labelledby="tab-btn-impact">
            ${this.renderImpactTab()}
          </div>

          <div class="tab-panel ${this.activeTab === 'tab-evidence' ? 'active' : ''}" id="tab-evidence" role="tabpanel" aria-labelledby="tab-btn-evidence">
            ${this.renderEvidenceTab()}
          </div>

          <div class="tab-panel ${this.activeTab === 'tab-agents' ? 'active' : ''}" id="tab-agents" role="tabpanel" aria-labelledby="tab-btn-agents">
            ${this.renderAgentsTab()}
          </div>

          <div class="tab-panel ${this.activeTab === 'tab-recovery' ? 'active' : ''}" id="tab-recovery" role="tabpanel" aria-labelledby="tab-btn-recovery">
            ${this.renderRecoveryTab()}
          </div>

          <div class="tab-panel ${this.activeTab === 'tab-approval' ? 'active' : ''}" id="tab-approval" role="tabpanel" aria-labelledby="tab-btn-approval">
            ${this.renderApprovalTab()}
          </div>

          <div class="tab-panel ${this.activeTab === 'tab-outcome' ? 'active' : ''}" id="tab-outcome" role="tabpanel" aria-labelledby="tab-btn-outcome">
            ${this.renderOutcomeTab()}
          </div>
        </div>
      `;

      this.bindWorkspaceEvents();
    } catch (e) {
      container.innerHTML = `
        <div class="card p-6 text-center">
          <h3 class="text-critical font-bold mb-2">Error loading case</h3>
          <p class="text-sm text-muted">${e.message}</p>
          <button class="btn btn-secondary btn-sm mt-4" onclick="Dashboard.switchView('cases')">Return to Cases List</button>
        </div>
      `;
    }
  },

  // --------------------------------------------------------------------------
  // Tab A: Incident Summary
  // --------------------------------------------------------------------------

  renderSummaryTab() {
    const c = this.currentCase;
    return `
      <!-- Entity Cards -->
      <div class="entity-cards-grid">
        <div class="entity-card">
          <div class="label">Product / SKU</div>
          <div class="value">${c.product.name}</div>
          <div class="text-xs text-muted font-mono">${c.product.sku} • Cost: $${c.product.unitCost}</div>
        </div>
        <div class="entity-card">
          <div class="label">Primary Supplier</div>
          <div class="value">${c.supplier.name}</div>
          <div class="text-xs text-muted font-mono">${c.supplier.id} • Rel: ${c.supplier.reliabilityScore}</div>
        </div>
        <div class="entity-card">
          <div class="label">Inbound Shipment / PO</div>
          <div class="value">${c.shipment.id} (${c.shipment.poNumber})</div>
          <div class="text-xs text-muted">${c.shipment.carrier} • ${App.formatNumber(c.shipment.shippedQuantity)} ${c.shipment.unit}</div>
        </div>
        <div class="entity-card">
          <div class="label">Delivery ETA Revision</div>
          <div class="value" style="color:var(--color-critical);">+${c.shipment.delayDays} Days Delayed</div>
          <div class="text-xs text-muted">Original: ${App.formatDateTime(c.shipment.originalEta).split(' ')[0]}</div>
        </div>
      </div>

      <!-- Narrative Description -->
      <div class="card mb-6" style="border-left: 4px solid var(--color-primary);">
        <div class="card-header">
          <h3 class="card-title text-sm">Disruption Briefing</h3>
          <span class="text-xs text-muted">Last Verified: ${App.formatDateTime(c.impactAssessment.lastVerifiedTimestamp)}</span>
        </div>
        <div class="card-body">
          <p class="text-sm font-semibold text-navy mb-2">${c.summary.headline}</p>
          <p class="text-sm text-secondary mb-3">${c.summary.whatHappened}</p>
          <div class="text-xs font-semibold" style="color:#C2410C;">
            Operational Urgency: ${c.summary.urgency}
          </div>
        </div>
      </div>

      <!-- Split View: Known Facts vs Unverified Claims -->
      <div class="facts-split-grid">
        <div class="facts-panel verified">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold" style="color:var(--trust-verified-text);">Known Verified Facts</h4>
            ${App.renderTrustBadge('verified')}
          </div>
          <ul class="facts-list">
            ${c.summary.knownFacts.map(fact => `
              <li>
                <svg viewBox="0 0 16 16" fill="currentColor" style="color:var(--color-teal);"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>
                <span>${fact}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="facts-panel unverified">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold" style="color:#B45309;">Unverified Claims & Assumptions</h4>
            ${App.renderTrustBadge('unverified')}
          </div>
          <ul class="facts-list">
            ${c.summary.unverifiedClaims.map(claim => `
              <li>
                <svg viewBox="0 0 16 16" fill="currentColor" style="color:var(--color-warning);"><path fill-rule="evenodd" d="M8.22 1.754a.75.75 0 0 0-1.44 0L1.18 13.504A.75.75 0 0 0 1.899 14.5h12.202a.75.75 0 0 0 .72-1.004L8.22 1.754ZM8 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>
                <span>${claim}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // Tab B: Impact Assessment
  // --------------------------------------------------------------------------

  renderImpactTab() {
    const c = this.currentCase;
    const impact = c.impactAssessment;

    return `
      <div class="overview-metrics-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: var(--space-5);">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Delayed Inbound</span>
            ${App.renderTrustBadge('verified')}
          </div>
          <div class="metric-value-row">
            <span class="metric-value">${App.formatNumber(impact.totalUnitsDelayed)}</span>
            <span class="metric-subtext">units</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Estimated Shortage</span>
            ${App.renderTrustBadge('estimate')}
          </div>
          <div class="metric-value-row">
            <span class="metric-value" style="color:var(--color-critical);">${App.formatNumber(impact.estimatedTotalShortage)}</span>
            <span class="metric-subtext">units</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Financial Risk Exposure</span>
            ${App.renderTrustBadge('estimate')}
          </div>
          <div class="metric-value-row">
            <span class="metric-value">${App.formatCurrency(impact.financialRiskExposure)}</span>
          </div>
          <span class="metric-subtext">Margin loss + SLA penalty</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Telemetry Freshness</span>
            ${App.renderTrustBadge('stale', 'Refreshed')}
          </div>
          <div class="metric-value-row">
            <span class="metric-value" style="font-size:1.5rem;">${App.formatTimeAgo(impact.lastVerifiedTimestamp)}</span>
          </div>
          <span class="metric-subtext">${App.formatDateTime(impact.lastVerifiedTimestamp)}</span>
        </div>
      </div>

      <!-- Network Location Stock Runway Table -->
      <div class="card mb-6">
        <div class="card-header">
          <div>
            <h3 class="card-title text-sm">Location Stock Coverage & Depletion Forecast</h3>
            <div class="card-subtitle">Differential stockout runway calculated deterministically across receiving network</div>
          </div>
          ${App.renderTrustBadge('estimate')}
        </div>
        <div class="table-responsive">
          <table class="location-comparison-table" aria-label="Stock Coverage by Facility">
            <thead>
              <tr>
                <th scope="col">Facility Name & Role</th>
                <th scope="col">On-Hand Stock</th>
                <th scope="col">Safety Stock Policy</th>
                <th scope="col">Daily Outflow</th>
                <th scope="col">Days of Coverage</th>
                <th scope="col">Runway Status</th>
                <th scope="col">Transfer Capacity</th>
              </tr>
            </thead>
            <tbody>
              ${impact.locations.map(loc => {
                const isCrit = loc.daysCoverage <= 2.0;
                const barFillWidth = Math.min(100, Math.round((loc.daysCoverage / 7.0) * 100));
                const barColor = isCrit ? 'var(--color-critical)' : 'var(--color-teal)';
                return `
                  <tr>
                    <td>
                      <div class="font-bold text-navy">${loc.name}</div>
                      <div class="text-xs text-muted font-mono">${loc.id} • ${loc.role}</div>
                    </td>
                    <td>
                      <span class="font-semibold">${App.formatNumber(loc.onHand)}</span> units
                      <div class="text-xs text-muted">${App.renderTrustBadge(isCrit ? 'stale' : 'verified')}</div>
                    </td>
                    <td>
                      <span>${App.formatNumber(loc.safetyStock)} units</span>
                      <div class="text-xs text-muted">(4.0d mandate)</div>
                    </td>
                    <td>${App.formatNumber(loc.dailyDemand)} units/day</td>
                    <td>
                      <div class="font-bold ${isCrit ? 'text-critical' : 'text-teal'}" style="font-size:1.125rem;">
                        ${loc.daysCoverage.toFixed(1)} Days
                      </div>
                      <div class="runway-bar-container">
                        <div class="runway-bar-fill" style="width: ${barFillWidth}%; background-color: ${barColor};"></div>
                      </div>
                    </td>
                    <td>
                      <span class="badge ${isCrit ? 'badge-critical' : 'badge-low'}">${loc.coverageStatus}</span>
                      ${loc.projectedStockoutHours ? `<div class="text-xs text-critical font-bold mt-1">Empty in ~${loc.projectedStockoutHours} hrs</div>` : ''}
                    </td>
                    <td>
                      ${loc.transferAvailableUnits > 0 ? `
                        <span class="badge badge-low">+${App.formatNumber(loc.transferAvailableUnits)} units available</span>
                      ` : `
                        <span class="text-xs text-muted">0 (Buffer depleted)</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Calculation Assumptions -->
      <div class="card" style="background:var(--color-surface-subtle);">
        <div class="card-body">
          <div class="flex items-center gap-2 mb-2">
            ${App.renderTrustBadge('assumption')}
            <h4 class="text-sm font-bold text-navy">Calculation Modeling Assumptions</h4>
          </div>
          <ul style="padding-left: 1.25rem; font-size: var(--font-size-xs); color: var(--color-text-secondary); display:flex; flex-direction:column; gap:4px;">
            ${impact.calculationAssumptions.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // Tab C: Evidence Ledger
  // --------------------------------------------------------------------------

  renderEvidenceTab() {
    const c = this.currentCase;

    return `
      <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 class="text-base font-bold text-navy">Authoritative Evidence & Ingested Telemetry</h3>
          <p class="text-xs text-muted">Every operational parameter is tied to verifiable source records.</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-add-evidence-dialog">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
          <span>Attach Supporting Evidence</span>
        </button>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4);">
        ${c.evidence.map(ev => `
          <div class="card" style="border-left: 4px solid ${
            ev.verificationState === 'Verified' ? 'var(--color-teal)' :
            ev.verificationState === 'Stale' ? 'var(--color-warning)' :
            ev.verificationState === 'Conflicting' ? 'var(--color-critical)' : '#94A3B8'
          };">
            <div class="card-header">
              <span class="code-tag font-bold">${ev.id}</span>
              ${App.renderTrustBadge(ev.verificationState)}
            </div>
            <div class="card-body">
              <div class="font-bold text-navy text-sm mb-1">${ev.source}</div>
              <div class="text-xs text-muted mb-2">${ev.type} • Timestamp: ${App.formatDateTime(ev.timestamp)}</div>
              <p class="text-sm text-secondary mb-3">${ev.summary}</p>
              <div class="flex justify-between items-center text-xs text-muted border-t pt-2">
                <span>Confidence: <strong>${ev.confidence}</strong></span>
                <span class="font-mono text-xs">${ev.documentRef}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // Tab D: Agent Investigation Log
  // --------------------------------------------------------------------------

  renderAgentsTab() {
    const c = this.currentCase;

    return `
      <div class="mb-4">
        <h3 class="text-base font-bold text-navy">Specialized Agent Execution Trace</h3>
        <p class="text-xs text-muted">Auditable record of multi-agent task execution, tool results, and findings.</p>
      </div>

      <div class="agent-timeline">
        ${c.agentTasks.map(task => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-header">
              <div class="flex items-center gap-2">
                <span class="badge" style="background:var(--color-primary-subtle); color:var(--color-primary); font-weight:var(--font-weight-bold);">
                  ${task.agent}
                </span>
                <span class="font-bold text-navy text-sm">${task.title}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="badge ${task.status === 'Completed' ? 'badge-low' : 'badge-high'}">${task.status}</span>
                <span class="text-xs text-muted font-mono">${task.endTime ? App.formatTimeAgo(task.endTime) : 'Running...'}</span>
              </div>
            </div>

            <p class="text-sm text-secondary mb-2">${task.finding}</p>

            <div class="flex items-center justify-between text-xs text-muted flex-wrap gap-2 border-t pt-2 mt-2">
              <div>
                Evidence Anchors: 
                ${task.evidenceRefs.length > 0 ? task.evidenceRefs.map(r => `<span class="code-tag">${r}</span>`).join(' ') : 'None referenced'}
              </div>
              <div>
                Missing / Unverified: <em>${task.missingInfo}</em>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // Tab E: Recovery Options Comparison
  // --------------------------------------------------------------------------

  renderRecoveryTab() {
    const c = this.currentCase;

    return `
      <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 class="text-base font-bold text-navy">Recovery Strategy Comparison Matrix</h3>
          <p class="text-xs text-muted">Select an option to review operational constraints, lead time trade-offs, and financial impact.</p>
        </div>
        <span class="trust-badge trust-estimate">Deterministic Trade-off Analysis</span>
      </div>

      <div class="recovery-comparison-grid">
        ${c.recoveryOptions.map(opt => {
          const isSelected = opt.id === this.selectedOptionId;
          const isRecommended = opt.isRecommended;
          return `
            <div class="recovery-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}" onclick="CaseDetailController.selectOption('${opt.id}')">
              <div class="flex justify-between items-start mb-2">
                <span class="code-tag font-bold">${opt.id}</span>
                <span class="badge ${
                  opt.feasibility === 'Feasible' ? 'badge-low' :
                  opt.feasibility === 'Needs Verification' ? 'badge-medium' : 'badge-critical'
                }">${opt.feasibility}</span>
              </div>

              <h4 class="text-base font-bold text-navy mb-1">${opt.name}</h4>
              <div class="text-xs text-muted mb-4">${opt.type}</div>

              <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-4);">
                <div class="recovery-metric-pill">
                  <div class="text-xs text-muted">LEAD TIME</div>
                  <div class="font-bold text-navy">${opt.leadTimeDisplay}</div>
                </div>
                <div class="recovery-metric-pill">
                  <div class="text-xs text-muted">EST. COST</div>
                  <div class="font-bold text-navy">${opt.estimatedCost === 0 ? '$0 (No expedite)' : App.formatCurrency(opt.estimatedCost)}</div>
                </div>
                <div class="recovery-metric-pill">
                  <div class="text-xs text-muted">SHORTAGE MITIGATED</div>
                  <div class="font-bold" style="color: ${opt.shortageReductionPct > 80 ? 'var(--color-teal)' : 'var(--color-warning)'};">
                    ${opt.shortageReductionPct}% (${App.formatNumber(opt.unitsRecovered)} u)
                  </div>
                </div>
                <div class="recovery-metric-pill">
                  <div class="text-xs text-muted">STATUS</div>
                  <div class="font-semibold text-xs">${isSelected ? 'Active Selection' : 'Click to Inspect'}</div>
                </div>
              </div>

              <div class="text-xs text-secondary mb-2">
                <strong>Capacity Constraints:</strong> ${opt.capacityConstraints}
              </div>

              <div class="text-xs text-muted mb-3">
                <strong>Risks & Assumptions:</strong> ${opt.risksAndAssumptions}
              </div>

              <div class="mt-auto border-t pt-2 flex justify-between items-center text-xs">
                <span>Evidence: ${opt.supportingEvidence.map(e => `<span class="code-tag">${e}</span>`).join(' ') || 'None'}</span>
                <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="event.stopPropagation(); CaseDetailController.selectOption('${opt.id}')">
                  ${isSelected ? 'Selected' : 'Select Option'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  selectOption(optId) {
    this.selectedOptionId = optId;
    this.render(this.currentCase.id);
    App.showToast(`Selected option ${optId}. Review recommendation and approve in Tab F.`, 'info');
  },

  // --------------------------------------------------------------------------
  // Tab F: Recommendation & Human Approval
  // --------------------------------------------------------------------------

  renderApprovalTab() {
    const c = this.currentCase;
    const rec = c.recommendation;
    const recommendedOpt = c.recoveryOptions.find(o => o.id === rec.recommendedOptionId) || c.recoveryOptions[0];
    const isApproved = c.approval?.status === 'Approved';
    const isRejected = c.approval?.status === 'Rejected';

    return `
      <!-- Recommendation Brief -->
      <div class="recommendation-banner">
        <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" style="width:20px;height:20px;color:var(--color-teal)"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>
            <h3 class="text-base font-bold text-navy">Recommended Action: ${rec.title}</h3>
          </div>
          <span class="badge badge-low">Recommended Candidate</span>
        </div>
        <p class="text-sm text-secondary mb-3">${rec.rationale}</p>

        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-4); background: white; padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid #99F6E4;">
          <div class="text-xs">
            <strong style="color:var(--color-navy);">Trade-offs Considered:</strong>
            <div class="text-muted mt-1">${rec.tradeoffs}</div>
          </div>
          <div class="text-xs">
            <strong style="color:var(--color-warning);">Uncertainties & Boundary Conditions:</strong>
            <div class="text-muted mt-1">${rec.uncertainty}</div>
          </div>
        </div>
      </div>

      <!-- Human Approval Decision Form -->
      <div class="approval-form-box">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h4 class="text-base font-bold text-navy">Operations Manager Sign-off</h4>
            <p class="text-xs text-muted">All execution triggers require human sign-off. High-impact operational moves cannot proceed autonomously.</p>
          </div>
          <div>
            ${c.approval?.status ? `<span class="badge ${isApproved ? 'badge-low' : (isRejected ? 'badge-critical' : 'badge-high')}">Current: ${c.approval.status}</span>` : ''}
          </div>
        </div>

        ${isApproved ? `
          <div class="card p-4 mb-4" style="background:#F0FDF4; border-color:#86EFAC;">
            <div class="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 16 16" fill="currentColor" style="color:var(--color-teal); width:18px;height:18px;"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>
              <h5 class="text-sm font-bold" style="color:#11685C;">Recommendation Authorized & Execution Initiated</h5>
            </div>
            <div class="text-xs text-secondary">
              Approved by: <strong>${c.approval.approverName}</strong> at ${App.formatDateTime(c.approval.timestamp)}.
            </div>
            <div class="text-xs text-secondary mt-1">
              Decision Note: <em>"${c.approval.notes}"</em>
            </div>
          </div>
        ` : ''}

        <form id="approval-form">
          <div class="form-group">
            <label class="form-label" for="approver-name">Approver Full Name / Role <span class="required">*</span></label>
            <input type="text" id="approver-name" class="form-input" value="${c.approval?.approverName || 'Alex Morgan (Ops Manager)'}" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="approval-notes">Authorization Notes / Operational Constraints</label>
            <textarea id="approval-notes" class="form-textarea" placeholder="Add specific guidance for dispatch team, e.g. 'Ensure cold chain transit log is attached to bill of lading'">${c.approval?.notes || ''}</textarea>
          </div>

          <div class="flex items-center gap-3 mt-4 flex-wrap">
            <button type="button" class="btn btn-teal" id="btn-submit-approve">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>
              <span>Approve Recommendation</span>
            </button>

            <button type="button" class="btn btn-secondary" id="btn-submit-more-investigation">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
              <span>Request More Investigation</span>
            </button>

            <button type="button" class="btn btn-critical" id="btn-submit-reject">
              <span>Reject Strategy</span>
            </button>
          </div>
        </form>

        <div class="mt-4 text-xs text-muted flex items-center gap-2">
          <span class="badge badge-demo">Demo Safety Policy</span>
          <span>Clicking Approve updates prototype simulation state and audit logs. No real purchase order or carrier dispatch will be executed.</span>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // Tab G: Outcome Tracking
  // --------------------------------------------------------------------------

  renderOutcomeTab() {
    const c = this.currentCase;
    const outcome = c.outcome;

    return `
      <div class="outcome-tracker-box">
        <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 class="text-base font-bold text-navy">Post-Approval Execution & Outcome Tracking</h4>
            <p class="text-xs text-muted">Monitor dispatch milestones, verify resolution of shortage, and log audit variance.</p>
          </div>
          <span class="badge ${
            outcome.executionStatus === 'Completed' ? 'badge-low' :
            outcome.executionStatus === 'In Progress' ? 'badge-high' : 'badge-status-investigating'
          }">${outcome.executionStatus}</span>
        </div>

        <div class="overview-metrics-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: var(--space-5);">
          <div class="metric-card">
            <span class="metric-label">Execution Status</span>
            <div class="metric-value-row">
              <span class="text-xl font-bold text-navy">${outcome.executionStatus}</span>
            </div>
            <span class="metric-subtext">Resolution: ${outcome.resolutionState}</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">Actual Expenditure</span>
            <div class="metric-value-row">
              <span class="text-xl font-bold text-navy">${outcome.actualCost !== null ? App.formatCurrency(outcome.actualCost) : 'Pending Invoicing'}</span>
            </div>
            <span class="metric-subtext">Budget estimate: $1,450</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">Actual Stockout Avoided</span>
            <div class="metric-value-row">
              <span class="text-xl font-bold" style="color:var(--color-teal);">${outcome.actualStockoutHours !== null ? `${outcome.actualStockoutHours} Hours` : 'Tracking In-Flight'}</span>
            </div>
            <span class="metric-subtext">Projected averted: 25h</span>
          </div>
        </div>

        <div class="card p-4 mb-4">
          <h5 class="text-sm font-bold text-navy mb-2">Simulate Execution Milestones (Demo Controller)</h5>
          <div class="flex items-center gap-3 flex-wrap">
            <button class="btn btn-secondary btn-sm" onclick="CaseDetailController.updateOutcomeStatus('In Progress', 'Carrier truck #4902 dispatched from Central DC.')">
              Mark as In Progress
            </button>
            <button class="btn btn-teal btn-sm" onclick="CaseDetailController.updateOutcomeStatus('Completed', '3,500 units safely received at Depot B dock. Stockout fully averted.', 1450, 3500)">
              Mark as Completed & Resolved
            </button>
            <button class="btn btn-critical btn-sm" onclick="CaseDetailController.updateOutcomeStatus('Blocked', 'Corridor fog delay halted carrier on Highway 80.')">
              Mark as Blocked
            </button>
          </div>
        </div>

        <div class="text-xs text-muted">
          Last Outcome Note: <em>"${outcome.notes || 'None recorded.'}"</em>
        </div>
      </div>
    `;
  },

  async updateOutcomeStatus(status, note, actualCost = null, actualUnits = null) {
    await apiService.updateOutcome(this.currentCase.id, {
      executionStatus: status,
      notes: note,
      actualCost: actualCost,
      actualUnitsRecovered: actualUnits,
      resolutionState: status === 'Completed' ? 'Resolved' : 'In Progress'
    });
    App.showToast(`Outcome status updated to ${status}.`, 'success');
    this.render(this.currentCase.id);
  },

  // --------------------------------------------------------------------------
  // Event Bindings
  // --------------------------------------------------------------------------

  bindWorkspaceEvents() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.case-tabs-nav .tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.activeTab = targetTab;

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.case-tabs-container .tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(targetTab);
        if (panel) panel.classList.add('active');
      });
    });

    // Refresh Assessment Button
    const refreshBtn = document.getElementById('btn-refresh-case');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        const icon = refreshBtn.querySelector('svg');
        if (icon) icon.classList.add('spinner');

        await apiService.refreshAssessment(this.currentCase.id);
        App.showToast('Re-evaluated stock depletion runway against real-time POS velocity.', 'success');
        this.render(this.currentCase.id);
      });
    }

    // Request More Investigation Button
    const reqInvestBtn = document.getElementById('btn-request-investigation');
    if (reqInvestBtn) {
      reqInvestBtn.addEventListener('click', () => {
        const query = prompt('Enter investigation instructions for the Disruption Investigator:', 'Verify intermodal container rail ramp transfer schedule');
        if (query && query.trim()) {
          apiService.requestMoreInvestigation(this.currentCase.id, query.trim()).then(() => {
            App.showToast('Specialist agent dispatched with supplemental inquiry.', 'info');
            this.activeTab = 'tab-agents';
            this.render(this.currentCase.id);
          });
        }
      });
    }

    // Back to cases
    const backBtn = document.getElementById('btn-back-to-cases');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        Dashboard.switchView('cases');
      });
    }

    // Add Evidence Dialog
    const addEvBtn = document.getElementById('btn-add-evidence-dialog');
    if (addEvBtn) {
      addEvBtn.addEventListener('click', () => {
        const source = prompt('Enter Evidence Source (e.g. Carrier EDI 214, IoT Telemetry, WMS Audit):', 'Carrier EDI 214 Revision');
        if (!source) return;
        const summary = prompt('Enter Evidence Summary / Findings:', 'Carrier confirmed dispatch scheduled for 16:00 UTC.');
        if (!summary) return;

        apiService.addEvidence(this.currentCase.id, {
          source: source,
          type: 'Manual Operator Document',
          verificationState: 'Unverified',
          summary: summary,
          confidence: 'Medium',
          documentRef: 'OPERATOR_ATTACHED_MANUAL.pdf'
        }).then(() => {
          App.showToast('Attached new evidence item with initial state: Unverified.', 'success');
          this.render(this.currentCase.id);
        });
      });
    }

    // Approval Decision Buttons
    const approverInput = document.getElementById('approver-name');
    const notesInput = document.getElementById('approval-notes');

    const approveBtn = document.getElementById('btn-submit-approve');
    if (approveBtn) {
      approveBtn.addEventListener('click', async () => {
        const name = approverInput?.value.trim() || 'Alex Morgan';
        const notes = notesInput?.value.trim() || 'Approved inter-warehouse stock transfer.';
        await apiService.submitApproval(this.currentCase.id, {
          decision: 'approve',
          approverName: name,
          notes: notes
        });
        App.showToast(`Plan approved by ${name}. Outcome tracker updated.`, 'success');
        this.activeTab = 'tab-outcome';
        this.render(this.currentCase.id);
      });
    }

    const rejectBtn = document.getElementById('btn-submit-reject');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', async () => {
        const name = approverInput?.value.trim() || 'Alex Morgan';
        const notes = notesInput?.value.trim() || 'Plan rejected due to budget limitations.';
        await apiService.submitApproval(this.currentCase.id, {
          decision: 'reject',
          approverName: name,
          notes: notes
        });
        App.showToast(`Recommendation rejected by ${name}.`, 'warning');
        this.render(this.currentCase.id);
      });
    }

    const moreInvestBtn = document.getElementById('btn-submit-more-investigation');
    if (moreInvestBtn) {
      moreInvestBtn.addEventListener('click', async () => {
        const name = approverInput?.value.trim() || 'Alex Morgan';
        const notes = notesInput?.value.trim() || 'Need additional verification before commitment.';
        await apiService.submitApproval(this.currentCase.id, {
          decision: 'investigate',
          approverName: name,
          notes: notes
        });
        App.showToast(`Additional investigation flagged by ${name}.`, 'info');
        this.render(this.currentCase.id);
      });
    }
  }
};

window.CaseDetailController = CaseDetailController;
