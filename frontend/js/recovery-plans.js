/**
 * SupplyGuard Recovery Plans Controller
 * Enterprise-wide recovery strategies ledger
 */

const RecoveryPlansController = {
  filterApproval: 'All',

  async render() {
    const container = document.getElementById('recovery-plans-container');
    if (!container) return;

    const plans = await apiService.getRecoveryPlans();
    const filtered = this.filterApproval === 'All' 
      ? plans 
      : plans.filter(p => p.approvalState.toLowerCase().replace(/\s+/g, '') === this.filterApproval.toLowerCase().replace(/\s+/g, ''));

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="text-xl font-bold text-navy">Enterprise Recovery Plans</h2>
          <p class="text-xs text-muted">Consolidated ledger of proposed and authorized mitigation initiatives across cases</p>
        </div>

        <div class="flex items-center gap-2">
          <label for="recovery-filter-status" class="text-xs text-muted font-medium">Approval Status:</label>
          <select id="recovery-filter-status" class="filter-select">
            <option value="All" ${this.filterApproval === 'All' ? 'selected' : ''}>All States</option>
            <option value="PendingReview" ${this.filterApproval === 'PendingReview' ? 'selected' : ''}>Pending Review</option>
            <option value="Approved" ${this.filterApproval === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Alternative" ${this.filterApproval === 'Alternative' ? 'selected' : ''}>Alternative Candidates</option>
          </select>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table" aria-label="Enterprise Recovery Plans Table">
            <thead>
              <tr>
                <th scope="col">Case ID & Risk</th>
                <th scope="col">Proposed Mitigation Action</th>
                <th scope="col">Strategy Type</th>
                <th scope="col">Lead Time</th>
                <th scope="col">Estimated Cost</th>
                <th scope="col">Shortage Relief</th>
                <th scope="col">Approval State</th>
                <th scope="col">Execution State</th>
                <th scope="col">Approver</th>
                <th scope="col" class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="10" class="text-center py-6 text-muted">No recovery plans matching selected filter.</td></tr>
              ` : filtered.map(p => `
                <tr class="row-interactive" onclick="Dashboard.openCaseDetail('${p.caseId}')">
                  <td>
                    <div class="flex items-center gap-1 mb-1">
                      <span class="code-tag font-bold">${p.caseId}</span>
                      ${App.renderRiskBadge(p.risk)}
                    </div>
                    <div class="text-xs text-muted" style="max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.caseTitle}</div>
                  </td>
                  <td>
                    <div class="font-bold text-navy">${p.actionName}</div>
                    ${p.isRecommended ? `<span class="badge badge-low mt-1">Recommended</span>` : ''}
                  </td>
                  <td><span class="text-xs text-muted">${p.type}</span></td>
                  <td><span class="font-semibold">${p.leadTimeDisplay}</span></td>
                  <td><span class="font-mono font-semibold">${p.estimatedCost === 0 ? '$0' : App.formatCurrency(p.estimatedCost)}</span></td>
                  <td>
                    <span class="font-bold" style="color: ${p.shortageReductionPct > 80 ? 'var(--color-teal)' : 'var(--color-warning)'};">
                      ${p.shortageReductionPct}%
                    </span>
                  </td>
                  <td>${App.renderStatusBadge(p.approvalState)}</td>
                  <td>
                    <span class="badge ${p.executionState === 'Completed' ? 'badge-low' : (p.executionState === 'In Progress' ? 'badge-high' : 'badge-status-investigating')}">
                      ${p.executionState}
                    </span>
                  </td>
                  <td><span class="text-xs">${p.approverName}</span></td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); Dashboard.openCaseDetail('${p.caseId}')">
                      View Case →
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const selectEl = document.getElementById('recovery-filter-status');
    if (selectEl) {
      selectEl.addEventListener('change', (e) => {
        this.filterApproval = e.target.value;
        this.render();
      });
    }
  }
};

window.RecoveryPlansController = RecoveryPlansController;
