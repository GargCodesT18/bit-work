/**
 * SupplyGuard Dashboard Router & Overview Controller
 */

const Dashboard = {
  currentView: 'overview',
  activeCaseId: 'SC-2026-001',

  init() {
    this.bindSidebar();
    this.bindTopbar();
    this.handleRouteFromUrl();
    window.addEventListener('popstate', () => this.handleRouteFromUrl());
  },

  handleRouteFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const caseParam = params.get('case');
    const actionParam = params.get('action');

    if (caseParam) {
      this.activeCaseId = caseParam;
      this.switchView('case-detail');
    } else if (viewParam) {
      this.switchView(viewParam);
    } else {
      this.switchView('overview');
    }

    if (actionParam === 'report') {
      setTimeout(() => {
        if (window.Monitoring) {
          Monitoring.openReportModal();
        }
      }, 300);
    }
  },

  bindSidebar() {
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const view = item.getAttribute('data-view');
        if (view) {
          e.preventDefault();
          this.switchView(view);
          this.updateUrlParams({ view, case: null });
        }
      });
    });

    // Collapse toggle
    const collapseBtn = document.querySelector('.sidebar-collapse-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-sidebar-toggle');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  },

  bindTopbar() {
    // Refresh button
    const refreshBtn = document.getElementById('btn-refresh-data');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        const icon = refreshBtn.querySelector('svg');
        if (icon) icon.classList.add('spinner');
        refreshBtn.disabled = true;

        await apiService.delay(350);
        await this.loadActiveView();
        
        const timestampEl = document.getElementById('last-refresh-time');
        if (timestampEl) timestampEl.textContent = 'Just now';

        if (icon) icon.classList.remove('spinner');
        refreshBtn.disabled = false;
        App.showToast('Workspace data refreshed from signal telemetry.', 'success');
      });
    }

    // Topbar Search
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = searchInput.value.trim();
          if (val) {
            this.switchView('cases');
            if (window.CasesController) {
              CasesController.setSearch(val);
            }
          }
        }
      });
    }

    // Notification Menu Indicator
    const notifBtn = document.getElementById('btn-notifications');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        App.showToast('Active alert: 4-day delivery lag flagged on PO-9402 (SC-2026-001).', 'warning');
      });
    }
  },

  updateUrlParams(paramsObj) {
    const url = new URL(window.location);
    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key] === null || paramsObj[key] === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, paramsObj[key]);
      }
    });
    window.history.pushState({}, '', url);
  },

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav link
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const v = item.getAttribute('data-view');
      if (v === viewName || (viewName === 'case-detail' && v === 'cases')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update views visibility
    document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update breadcrumb
    this.updateBreadcrumb(viewName);

    // Load view data
    this.loadActiveView();
  },

  updateBreadcrumb(viewName) {
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if (!breadcrumbCurrent) return;

    switch (viewName) {
      case 'overview':
        breadcrumbCurrent.textContent = 'Executive Overview';
        break;
      case 'cases':
        breadcrumbCurrent.textContent = 'Disruption Cases';
        break;
      case 'case-detail':
        breadcrumbCurrent.textContent = `Case Investigation / ${this.activeCaseId}`;
        break;
      case 'monitoring':
        breadcrumbCurrent.textContent = 'Risk Monitoring & Alert Intake';
        break;
      case 'recovery-plans':
        breadcrumbCurrent.textContent = 'Enterprise Recovery Plans';
        break;
      case 'audit-log':
        breadcrumbCurrent.textContent = 'Activity & Audit Log';
        break;
      case 'settings':
        breadcrumbCurrent.textContent = 'System & Demo Settings';
        break;
      default:
        breadcrumbCurrent.textContent = 'Dashboard';
    }
  },

  async loadActiveView() {
    switch (this.currentView) {
      case 'overview':
        await this.renderOverview();
        break;
      case 'cases':
        if (window.CasesController) await CasesController.render();
        break;
      case 'case-detail':
        if (window.CaseDetailController) await CaseDetailController.render(this.activeCaseId);
        break;
      case 'monitoring':
        if (window.Monitoring) await Monitoring.render();
        break;
      case 'recovery-plans':
        if (window.RecoveryPlansController) await RecoveryPlansController.render();
        break;
      case 'audit-log':
        if (window.AuditLogController) await AuditLogController.render();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }
  },

  // --------------------------------------------------------------------------
  // Overview View Rendering
  // --------------------------------------------------------------------------

  async renderOverview() {
    const summary = await apiService.getDashboardSummary();
    const cases = await apiService.getCases();
    const recentAudit = await apiService.getAuditEvents();

    // Update KPI Metric Cards
    const activeEl = document.getElementById('kpi-active-disruptions');
    if (activeEl) activeEl.textContent = summary.activeDisruptions;

    const highRiskEl = document.getElementById('kpi-high-risk');
    if (highRiskEl) highRiskEl.textContent = summary.highRiskCases;

    const productsEl = document.getElementById('kpi-products-risk');
    if (productsEl) productsEl.textContent = summary.productsAtRisk;

    const approvalEl = document.getElementById('kpi-awaiting-approval');
    if (approvalEl) approvalEl.textContent = summary.casesAwaitingApproval;

    // Render Risk Distribution
    this.renderRiskDistribution(summary.riskDistribution);

    // Render Risk Trend SVG Chart
    this.renderTrendChart(summary.riskTrend);

    // Render Active Cases Table
    this.renderActiveCasesTable(cases);

    // Render Recent Activity Stream
    this.renderRecentActivity(recentAudit.slice(0, 5));
  },

  renderRiskDistribution(dist) {
    const container = document.getElementById('overview-risk-distribution');
    if (!container) return;

    const total = (dist.critical + dist.high + dist.medium + dist.low) || 1;
    const pCrit = Math.round((dist.critical / total) * 100);
    const pHigh = Math.round((dist.high / total) * 100);
    const pMed = Math.round((dist.medium / total) * 100);
    const pLow = Math.round((dist.low / total) * 100);

    container.innerHTML = `
      <div class="distribution-bars">
        <div class="dist-item">
          <span class="badge badge-critical" style="width:75px;justify-content:center;">Critical</span>
          <div class="dist-bar-wrap">
            <div class="dist-bar-fill" style="width: ${pCrit}%; background-color: var(--color-critical);"></div>
          </div>
          <span class="font-mono font-semibold" style="width:25px;text-align:right;">${dist.critical}</span>
        </div>
        <div class="dist-item">
          <span class="badge badge-high" style="width:75px;justify-content:center;">High</span>
          <div class="dist-bar-wrap">
            <div class="dist-bar-fill" style="width: ${pHigh}%; background-color: #EA580C;"></div>
          </div>
          <span class="font-mono font-semibold" style="width:25px;text-align:right;">${dist.high}</span>
        </div>
        <div class="dist-item">
          <span class="badge badge-medium" style="width:75px;justify-content:center;">Medium</span>
          <div class="dist-bar-wrap">
            <div class="dist-bar-fill" style="width: ${pMed}%; background-color: var(--color-warning);"></div>
          </div>
          <span class="font-mono font-semibold" style="width:25px;text-align:right;">${dist.medium}</span>
        </div>
        <div class="dist-item">
          <span class="badge badge-low" style="width:75px;justify-content:center;">Low</span>
          <div class="dist-bar-wrap">
            <div class="dist-bar-fill" style="width: ${pLow}%; background-color: var(--color-teal);"></div>
          </div>
          <span class="font-mono font-semibold" style="width:25px;text-align:right;">${dist.low}</span>
        </div>
      </div>
      <div class="mt-4 text-xs text-muted">
        Risk level is determined by shortage runway hours and financial exposure.
      </div>
    `;
  },

  renderTrendChart(trendData) {
    const container = document.getElementById('overview-trend-chart');
    if (!container) return;

    if (!trendData || trendData.length === 0) {
      container.innerHTML = `<div class="empty-state"><p class="text-xs text-muted">No trend data available for current date range.</p></div>`;
      return;
    }

    const width = 500;
    const height = 140;
    const padding = 20;

    const maxVal = Math.max(...trendData.map(d => Math.max(d.detected, d.resolved)), 8);
    const xStep = (width - padding * 2) / (trendData.length - 1);

    const pointsDetected = trendData.map((d, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((d.detected / maxVal) * (height - padding * 2));
      return { x, y, val: d.detected, date: d.date };
    });

    const linePathDetected = pointsDetected.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePathDetected} L ${pointsDetected[pointsDetected.length - 1].x} ${height - padding} L ${pointsDetected[0].x} ${height - padding} Z`;

    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2457D6" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#2457D6" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal grid lines -->
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#CBD5E1" stroke-width="1"/>

        <!-- Area fill -->
        <path d="${areaPath}" class="chart-area" />

        <!-- Line -->
        <path d="${linePathDetected}" class="chart-line" />

        <!-- Points -->
        ${pointsDetected.map(p => `
          <circle cx="${p.x}" cy="${p.y}" class="chart-dot">
            <title>${p.date}: ${p.val} disruptions detected</title>
          </circle>
        `).join('')}

        <!-- Date labels -->
        ${pointsDetected.map(p => `
          <text x="${p.x}" y="${height - 4}" font-size="9" fill="#94A3B8" text-anchor="middle">${p.date.slice(5)}</text>
        `).join('')}
      </svg>
    `;
  },

  renderActiveCasesTable(cases) {
    const tbody = document.getElementById('overview-cases-tbody');
    if (!tbody) return;

    if (cases.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-muted">No active disruption cases found.</td></tr>`;
      return;
    }

    tbody.innerHTML = cases.map(c => `
      <tr class="row-interactive" onclick="Dashboard.openCaseDetail('${c.id}')">
        <td><span class="code-tag font-bold">${c.id}</span></td>
        <td>
          <div class="font-semibold text-navy">${c.title}</div>
          <div class="text-xs text-muted">${c.disruptionType}</div>
        </td>
        <td>
          <div class="text-sm font-medium">${c.supplier.name}</div>
          <div class="text-xs text-muted">${c.shipment.poNumber} • ${c.shipment.carrier}</div>
        </td>
        <td>
          <div class="text-sm font-medium">${c.product.name}</div>
          <div class="text-xs text-muted">${c.impactAssessment.locations.map(l => l.name.split('(')[0].trim()).join(', ')}</div>
        </td>
        <td>${App.renderRiskBadge(c.risk)}</td>
        <td>
          <div>${App.renderStatusBadge(c.status)}</div>
          <div class="mt-1">${App.renderTriggerBadge(c.triggerSource)}</div>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); Dashboard.openCaseDetail('${c.id}')">
            View Case →
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderRecentActivity(events) {
    const container = document.getElementById('overview-recent-activity');
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = `<div class="text-muted text-xs p-4">No recent activity logged.</div>`;
      return;
    }

    container.innerHTML = events.map(e => `
      <div style="padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-subtle); display:flex; flex-direction:column; gap:2px;">
        <div class="flex justify-between items-center text-xs">
          <span class="font-semibold text-navy">${e.actorName}</span>
          <span class="text-muted">${App.formatTimeAgo(e.timestamp)}</span>
        </div>
        <div class="text-sm text-secondary">${e.summary}</div>
        <div class="flex items-center gap-2 mt-1">
          <span class="code-tag">${e.caseId}</span>
          <span class="text-xs text-muted">${e.eventType}</span>
        </div>
      </div>
    `).join('');
  },

  openCaseDetail(caseId) {
    this.activeCaseId = caseId;
    this.switchView('case-detail');
    this.updateUrlParams({ view: 'case-detail', case: caseId });
  },

  renderSettings() {
    const container = document.getElementById('settings-container');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="max-width: 680px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Demo Workspace Controls</h3>
            <div class="card-subtitle">Manage prototype data states, simulations, and reset flags</div>
          </div>
          <span class="badge badge-demo">Demo Mode</span>
        </div>
        <div class="card-body">
          <div class="mb-4">
            <h4 class="text-sm font-bold text-navy mb-1">State Persistence</h4>
            <p class="text-sm text-muted">All newly reported disruption cases, approved recovery plans, added evidence, and audit logs are safely stored in your browser's LocalStorage.</p>
          </div>
          <div class="divider"></div>
          <div class="mb-6">
            <h4 class="text-sm font-bold text-navy mb-1">Reset to Default Baseline</h4>
            <p class="text-sm text-muted">Clear all session updates and restore the canonical initial scenario (Case SC-2026-001 with Northstar Foods Cooking Oil delay).</p>
          </div>
          <button class="btn btn-critical" id="btn-reset-workspace-data">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .2.08.39.22.53l2.25 2.25a.75.75 0 0 0 1.06-1.06L8.75 7.69V3.75Z" clip-rule="evenodd"/></svg>
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>
    `;

    const resetBtn = document.getElementById('btn-reset-workspace-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset all demo cases and approvals back to initial baseline?')) {
          await apiService.resetDemoData();
          App.showToast('Workspace data successfully reset to baseline.', 'success');
          Dashboard.switchView('overview');
        }
      });
    }
  }
};

window.Dashboard = Dashboard;
