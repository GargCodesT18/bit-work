/**
 * SupplyGuard Disruption Cases Controller
 * Interactive search, filtering, and case listing
 */

const CasesController = {
  filters: {
    search: '',
    risk: 'All',
    status: 'All',
    disruptionType: 'All',
    triggerSource: 'All',
    sortBy: 'risk'
  },

  setSearch(q) {
    this.filters.search = q;
    const searchInput = document.getElementById('cases-search-input');
    if (searchInput) searchInput.value = q;
    this.render();
  },

  async render() {
    const container = document.getElementById('cases-view-container');
    if (!container) return;

    const cases = await apiService.getCases(this.filters);

    container.innerHTML = `
      <!-- Filter Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-group">
          <div style="position:relative; width: 240px;">
            <input type="text" id="cases-search-input" class="form-input" placeholder="Search ID, supplier, SKU, location..." value="${this.filters.search}">
          </div>

          <select id="filter-risk" class="filter-select">
            <option value="All" ${this.filters.risk === 'All' ? 'selected' : ''}>Risk: All</option>
            <option value="Critical" ${this.filters.risk === 'Critical' ? 'selected' : ''}>Risk: Critical</option>
            <option value="High" ${this.filters.risk === 'High' ? 'selected' : ''}>Risk: High</option>
            <option value="Medium" ${this.filters.risk === 'Medium' ? 'selected' : ''}>Risk: Medium</option>
            <option value="Low" ${this.filters.risk === 'Low' ? 'selected' : ''}>Risk: Low</option>
          </select>

          <select id="filter-status" class="filter-select">
            <option value="All" ${this.filters.status === 'All' ? 'selected' : ''}>Status: All</option>
            <option value="Investigating" ${this.filters.status === 'Investigating' ? 'selected' : ''}>Investigating</option>
            <option value="Planning" ${this.filters.status === 'Planning' ? 'selected' : ''}>Planning</option>
            <option value="AwaitingApproval" ${this.filters.status === 'AwaitingApproval' ? 'selected' : ''}>Awaiting Approval</option>
            <option value="Approved" ${this.filters.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="InProgress" ${this.filters.status === 'InProgress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${this.filters.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>

          <select id="filter-type" class="filter-select">
            <option value="All" ${this.filters.disruptionType === 'All' ? 'selected' : ''}>Type: All</option>
            <option value="Supplier Delay" ${this.filters.disruptionType === 'Supplier Delay' ? 'selected' : ''}>Supplier Delay</option>
            <option value="Warehouse Shutdown" ${this.filters.disruptionType === 'Warehouse Shutdown' ? 'selected' : ''}>Warehouse Shutdown</option>
            <option value="Transport Disruption" ${this.filters.disruptionType === 'Transport Disruption' ? 'selected' : ''}>Transport Disruption</option>
            <option value="Demand Spike" ${this.filters.disruptionType === 'Demand Spike' ? 'selected' : ''}>Demand Spike</option>
          </select>

          <select id="filter-trigger" class="filter-select">
            <option value="All" ${this.filters.triggerSource === 'All' ? 'selected' : ''}>Trigger: All</option>
            <option value="Proactive" ${this.filters.triggerSource === 'Proactive' ? 'selected' : ''}>Proactive Signal</option>
            <option value="Reported" ${this.filters.triggerSource === 'Reported' ? 'selected' : ''}>Reported Alert</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-sort" class="text-xs text-muted font-medium">Sort By:</label>
          <select id="filter-sort" class="filter-select">
            <option value="risk" ${this.filters.sortBy === 'risk' ? 'selected' : ''}>Highest Risk First</option>
            <option value="newest" ${this.filters.sortBy === 'newest' ? 'selected' : ''}>Newest First</option>
            <option value="oldest" ${this.filters.sortBy === 'oldest' ? 'selected' : ''}>Oldest First</option>
          </select>

          <button class="btn btn-secondary btn-sm" id="btn-clear-filters">Reset Filters</button>
        </div>
      </div>

      <!-- Cases Data Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table" aria-label="Disruption Cases Table">
            <thead>
              <tr>
                <th scope="col">Case ID</th>
                <th scope="col">Incident Description</th>
                <th scope="col">Supplier & PO</th>
                <th scope="col">Product & Locations</th>
                <th scope="col">Risk Level</th>
                <th scope="col">Status & Trigger</th>
                <th scope="col">Detected / Reported</th>
                <th scope="col" class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${cases.length === 0 ? `
                <tr>
                  <td colspan="8">
                    <div class="empty-state">
                      <div class="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </div>
                      <h4 class="empty-state-title">No matching disruption cases found</h4>
                      <p class="empty-state-description">Try adjusting your search criteria, clear active filters, or report a new operational incident.</p>
                      <button class="btn btn-secondary btn-sm" onclick="CasesController.resetFilters()">Clear All Filters</button>
                    </div>
                  </td>
                </tr>
              ` : cases.map(c => `
                <tr class="row-interactive" onclick="Dashboard.openCaseDetail('${c.id}')">
                  <td>
                    <span class="code-tag font-bold">${c.id}</span>
                  </td>
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
                    <div class="text-xs font-mono">${App.formatTimeAgo(c.createdAt)}</div>
                    <div class="text-xs text-muted">${App.formatDateTime(c.createdAt).split(' ')[0]}</div>
                  </td>
                  <td class="text-right">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); Dashboard.openCaseDetail('${c.id}')">
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

    this.bindEvents();
  },

  bindEvents() {
    const searchInput = document.getElementById('cases-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value;
        this.render();
      });
    }

    const bindSelect = (id, prop) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.filters[prop] = e.target.value;
          this.render();
        });
      }
    };

    bindSelect('filter-risk', 'risk');
    bindSelect('filter-status', 'status');
    bindSelect('filter-type', 'disruptionType');
    bindSelect('filter-trigger', 'triggerSource');
    bindSelect('filter-sort', 'sortBy');

    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.resetFilters());
    }
  },

  resetFilters() {
    this.filters = {
      search: '',
      risk: 'All',
      status: 'All',
      disruptionType: 'All',
      triggerSource: 'All',
      sortBy: 'risk'
    };
    this.render();
  }
};

window.CasesController = CasesController;
