/**
 * SupplyGuard Risk Monitoring & Alert Intake Controller
 */

const Monitoring = {
  async render() {
    const container = document.getElementById('monitoring-view-container');
    if (!container) return;

    const data = await apiService.getMonitoringData();

    container.innerHTML = `
      <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 class="text-xl font-bold text-navy">Risk Monitoring & Disruption Intake</h2>
          <p class="text-xs text-muted">Continuous telemetry observation and manual operational alert reporting</p>
        </div>

        <div class="flex items-center gap-3">
          <button class="btn btn-secondary btn-sm" id="btn-simulate-signal">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 2a.75.75 0 0 1 .75.75v1.06a5.5 5.5 0 0 1 4.44 4.44h1.06a.75.75 0 0 1 0 1.5h-1.06a5.5 5.5 0 0 1-4.44 4.44v1.06a.75.75 0 0 1-1.5 0v-1.06a5.5 5.5 0 0 1-4.44-4.44H1.75a.75.75 0 0 1 0-1.5h1.06a5.5 5.5 0 0 1 4.44-4.44V2.75A.75.75 0 0 1 8 2Zm0 3.5A3.5 3.5 0 1 0 8 12.5a3.5 3.5 0 0 0 0-7Z"/></svg>
            <span>Simulate Proactive Signal Ingestion</span>
          </button>
          <button class="btn btn-primary" id="btn-open-report-modal">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
            <span>Report a Disruption</span>
          </button>
        </div>
      </div>

      <!-- Proactive Monitoring Status Row -->
      <div class="overview-metrics-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: var(--space-6);">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Signal Telemetry Status</span>
            <span class="badge badge-demo">${data.mode}</span>
          </div>
          <div class="metric-value-row">
            <span class="metric-value" style="color:var(--color-teal);">${data.systemStatus}</span>
          </div>
          <span class="metric-subtext">Telemetry engine listening across 4 data feeds</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Signals Evaluated Today</span>
            ${App.renderTrustBadge('verified')}
          </div>
          <div class="metric-value-row">
            <span class="metric-value">${App.formatNumber(data.signalsEvaluatedToday)}</span>
          </div>
          <span class="metric-subtext">Last cycle: ${App.formatTimeAgo(data.lastEvaluation)}</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Active Detection Rules</span>
            <span class="badge badge-low">Operational</span>
          </div>
          <div class="metric-value-row">
            <span class="metric-value">${data.activeRules.length}</span>
            <span class="metric-subtext">Rules Enforced</span>
          </div>
          <span class="metric-subtext">Zero unhandled breaches</span>
        </div>
      </div>

      <!-- Active Rules & Detected Signal Feeds Grid -->
      <div class="overview-charts-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: var(--space-6);">
        <!-- Active Rules Table -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title text-sm">Deterministic Risk Rules</h3>
            <span class="badge badge-low">4 Active</span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Rule ID & Name</th>
                  <th>Trigger Logic</th>
                  <th>Scope</th>
                  <th>Breaches</th>
                </tr>
              </thead>
              <tbody>
                ${data.activeRules.map(rule => `
                  <tr>
                    <td>
                      <div class="font-bold text-navy text-xs">${rule.name}</div>
                      <span class="code-tag">${rule.id}</span>
                    </td>
                    <td class="text-xs text-muted">${rule.condition}</td>
                    <td class="text-xs">${rule.scope}</td>
                    <td><span class="badge badge-high">${rule.triggeredCount} today</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detected Signal Events -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title text-sm">Recently Detected Risk Signals</h3>
            <span class="text-xs text-muted">${data.detectedEvents.length} events logged</span>
          </div>
          <div class="card-body" style="padding: var(--space-3) var(--space-5);">
            <div style="display:flex; flex-direction:column; gap:var(--space-3);">
              ${data.detectedEvents.map(evt => `
                <div style="border-bottom: 1px solid var(--color-border-subtle); padding-bottom: var(--space-3);">
                  <div class="flex justify-between items-center text-xs mb-1">
                    <div class="flex items-center gap-2">
                      <span class="code-tag font-bold">${evt.id}</span>
                      <span class="font-semibold text-navy">${evt.entity}</span>
                    </div>
                    <span class="text-muted">${App.formatTimeAgo(evt.timestamp)}</span>
                  </div>
                  <div class="text-xs text-secondary mb-2">${evt.description}</div>
                  <div class="flex justify-between items-center text-xs">
                    <span class="badge ${evt.severity === 'Critical' ? 'badge-critical' : (evt.severity === 'High' ? 'badge-high' : 'badge-medium')}">
                      ${evt.severity}
                    </span>
                    ${evt.linkedCaseId ? `
                      <a href="#" class="font-semibold text-primary" onclick="event.preventDefault(); Dashboard.openCaseDetail('${evt.linkedCaseId}')">
                        Inspect Case ${evt.linkedCaseId} →
                      </a>
                    ` : `
                      <span class="text-muted">Unlinked Signal</span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindMonitoringEvents();
  },

  bindMonitoringEvents() {
    const reportBtn = document.getElementById('btn-open-report-modal');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => this.openReportModal());
    }

    const simBtn = document.getElementById('btn-simulate-signal');
    if (simBtn) {
      simBtn.addEventListener('click', async () => {
        simBtn.disabled = true;
        const newSig = await apiService.simulateSignalIngestion();
        App.showToast(`Proactive telemetry trigger ingested: ${newSig.id} (${newSig.entity})`, 'warning');
        this.render();
      });
    }
  },

  openReportModal() {
    App.openModal('modal-report-disruption');
    const form = document.getElementById('report-disruption-form');
    if (form) {
      form.reset();
      form.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));
    }
  },

  async handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('report-disruption-form');
    if (!form) return;

    const typeEl = document.getElementById('report-type');
    const supplierEl = document.getElementById('report-supplier');
    const productEl = document.getElementById('report-product');
    const locationEl = document.getElementById('report-location');
    const delayEl = document.getElementById('report-delay');
    const descEl = document.getElementById('report-desc');
    const refEl = document.getElementById('report-reference');
    const riskEl = document.getElementById('report-risk');

    let hasError = false;

    const validateField = (el) => {
      const parent = el.closest('.form-group');
      if (!el.value.trim()) {
        parent.classList.add('has-error');
        hasError = true;
      } else {
        parent.classList.remove('has-error');
      }
    };

    validateField(typeEl);
    validateField(supplierEl);
    validateField(productEl);
    validateField(locationEl);
    validateField(delayEl);
    validateField(descEl);

    if (hasError) {
      App.showToast('Please fill out all required incident fields.', 'error');
      return;
    }

    const submitBtn = document.getElementById('btn-submit-report');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const newCase = await apiService.createCase({
        disruptionType: typeEl.value,
        supplierName: supplierEl.value.trim(),
        productName: productEl.value.trim(),
        locationName: locationEl.value.trim(),
        delayDays: delayEl.value,
        description: descEl.value.trim(),
        shipmentRef: refEl?.value.trim() || null,
        risk: riskEl.value
      });

      App.closeModal('modal-report-disruption');
      App.showToast(`Case ${newCase.id} successfully initialized (Verification State: Unverified).`, 'success');

      // Navigate to the newly created case detail view!
      Dashboard.openCaseDetail(newCase.id);
    } catch (err) {
      App.showToast(`Error creating case: ${err.message}`, 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }
};

window.Monitoring = Monitoring;
