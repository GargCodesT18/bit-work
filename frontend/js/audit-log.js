/**
 * SupplyGuard Activity & Audit Log Controller
 * Append-oriented chronological record of actions, signals, and human sign-offs
 */

const AuditLogController = {
  filters: {
    actorType: 'All',
    eventType: 'All',
    caseId: 'All'
  },

  async render() {
    const container = document.getElementById('audit-log-container');
    if (!container) return;

    const events = await apiService.getAuditEvents(this.filters);

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold text-navy">Activity & Audit Trail</h2>
          <p class="text-xs text-muted">Append-only compliance log tracking every operational signal, agent finding, and human decision</p>
        </div>

        <div class="filter-group">
          <select id="audit-filter-actor" class="filter-select">
            <option value="All" ${this.filters.actorType === 'All' ? 'selected' : ''}>Actor: All</option>
            <option value="Human" ${this.filters.actorType === 'Human' ? 'selected' : ''}>Human Operators</option>
            <option value="Agent" ${this.filters.actorType === 'Agent' ? 'selected' : ''}>Autonomous Agents</option>
            <option value="System" ${this.filters.actorType === 'System' ? 'selected' : ''}>System Telemetry</option>
          </select>

          <select id="audit-filter-type" class="filter-select">
            <option value="All" ${this.filters.eventType === 'All' ? 'selected' : ''}>Event: All</option>
            <option value="Approval" ${this.filters.eventType === 'Approval' ? 'selected' : ''}>Approvals & Decisions</option>
            <option value="Evidence" ${this.filters.eventType === 'Evidence' ? 'selected' : ''}>Evidence Appended</option>
            <option value="Assessment" ${this.filters.eventType === 'Assessment' ? 'selected' : ''}>Assessments</option>
            <option value="Case" ${this.filters.eventType === 'Case' ? 'selected' : ''}>Case Creation</option>
          </select>

          <button class="btn btn-secondary btn-sm" id="btn-audit-clear">Reset Filters</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table" aria-label="System Audit Events Table">
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Case ID</th>
                <th scope="col">Actor & Role</th>
                <th scope="col">Event Type</th>
                <th scope="col">Action Summary</th>
                <th scope="col">State Mutation / Diff</th>
              </tr>
            </thead>
            <tbody>
              ${events.length === 0 ? `
                <tr><td colspan="6" class="text-center py-6 text-muted">No audit events match current criteria.</td></tr>
              ` : events.map(e => `
                <tr>
                  <td>
                    <div class="text-xs font-mono font-semibold">${App.formatTimeAgo(e.timestamp)}</div>
                    <div class="text-xs text-muted">${App.formatDateTime(e.timestamp)}</div>
                  </td>
                  <td>
                    ${e.caseId !== 'SYSTEM' ? `
                      <a href="#" class="code-tag font-bold" onclick="event.preventDefault(); Dashboard.openCaseDetail('${e.caseId}')">${e.caseId}</a>
                    ` : `
                      <span class="code-tag text-muted">SYSTEM</span>
                    `}
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <span class="badge ${
                        e.actorType === 'Human' ? 'badge-low' :
                        e.actorType === 'Agent' ? 'badge-high' : 'badge-source-proactive'
                      }">${e.actorType}</span>
                      <span class="font-bold text-navy text-xs">${e.actorName}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-xs font-semibold">${e.eventType}</span>
                  </td>
                  <td>
                    <span class="text-sm text-secondary">${e.summary}</span>
                  </td>
                  <td>
                    <span class="code-tag text-xs" style="color:#0F766E;">${e.diff || '—'}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const actorSelect = document.getElementById('audit-filter-actor');
    if (actorSelect) {
      actorSelect.addEventListener('change', (e) => {
        this.filters.actorType = e.target.value;
        this.render();
      });
    }

    const typeSelect = document.getElementById('audit-filter-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.filters.eventType = e.target.value;
        this.render();
      });
    }

    const clearBtn = document.getElementById('btn-audit-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.filters = { actorType: 'All', eventType: 'All', caseId: 'All' };
        this.render();
      });
    }
  }
};

window.AuditLogController = AuditLogController;
