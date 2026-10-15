/**
 * SupplyGuard Global Application Helpers & UI Component Utilities
 */

const App = {
  // --------------------------------------------------------------------------
  // Formatting Utilities
  // --------------------------------------------------------------------------

  formatDateTime(isoStr) {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + ' UTC';
    } catch {
      return isoStr;
    }
  },

  formatTimeAgo(isoStr) {
    if (!isoStr) return 'N/A';
    try {
      const diffMs = Date.now() - new Date(isoStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return isoStr;
    }
  },

  formatCurrency(val) {
    if (val === null || val === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  },

  formatNumber(val) {
    if (val === null || val === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(val);
  },

  // --------------------------------------------------------------------------
  // Trust Classification Badges (Data Integrity System)
  // --------------------------------------------------------------------------

  renderTrustBadge(state, labelOverride = null) {
    const s = (state || 'unknown').toLowerCase();
    let badgeClass = 'trust-unknown';
    let label = labelOverride || 'Unknown';
    let iconSvg = '';
    let tooltip = '';

    switch (s) {
      case 'verified':
        badgeClass = 'trust-verified';
        label = labelOverride || 'Verified Fact';
        tooltip = 'Backed by authoritative carrier EDI, sensor telemetry, or audited warehouse record.';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>`;
        break;
      case 'estimate':
        badgeClass = 'trust-estimate';
        label = labelOverride || 'Estimate';
        tooltip = 'Calculated or projected based on consumption rates, lead times, or run-rate models.';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3 3.75a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 3.75Zm0 4.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8Zm.75 3.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"/></svg>`;
        break;
      case 'assumption':
        badgeClass = 'trust-assumption';
        label = labelOverride || 'Assumption';
        tooltip = 'Applied heuristic or standard operational baseline due to missing or delayed inputs.';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4.5 2A1.5 1.5 0 0 0 3 3.5v10.25a.75.75 0 0 0 1.18.614L8 11.455l3.82 2.909A.75.75 0 0 0 13 13.75V3.5A1.5 1.5 0 0 0 11.5 2h-7Z"/></svg>`;
        break;
      case 'stale':
        badgeClass = 'trust-stale';
        label = labelOverride || 'Stale Data';
        tooltip = 'Authoritative record exists but has passed the operational freshness threshold (>4h).';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .2.08.39.22.53l2.25 2.25a.75.75 0 0 0 1.06-1.06L8.75 7.69V3.75Z" clip-rule="evenodd"/></svg>`;
        break;
      case 'conflicting':
        badgeClass = 'trust-conflicting';
        label = labelOverride || 'Conflicting Evidence';
        tooltip = 'Independent data sources or telemetry feeds report contradictory parameters.';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm1.25 6.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clip-rule="evenodd"/></svg>`;
        break;
      default:
        badgeClass = 'trust-unknown';
        label = labelOverride || 'Unknown';
        tooltip = 'Information is unavailable; awaiting telemetry, dispatch slip, or manual verification.';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.75-4.5a.75.75 0 0 1 1.5 0v.5a.75.75 0 0 1-1.5 0v-.5ZM8 4.25c-1.38 0-2.5 1.12-2.5 2.5a.75.75 0 0 0 1.5 0c0-.55.45-1 1-1s1 .45 1 1c0 .4-.23.77-.59.95l-.66.33a2.25 2.25 0 0 0-1.25 2.01v.21a.75.75 0 0 0 1.5 0v-.21c0-.4.23-.77.59-.95l.66-.33A2.5 2.5 0 0 0 10.5 6.75c0-1.38-1.12-2.5-2.5-2.5Z" clip-rule="evenodd"/></svg>`;
    }

    return `<span class="trust-badge ${badgeClass}" title="${tooltip}" tabindex="0" aria-label="${label}: ${tooltip}">${iconSvg}<span>${label}</span></span>`;
  },

  // --------------------------------------------------------------------------
  // Badges: Risk, Status, Trigger Source
  // --------------------------------------------------------------------------

  renderRiskBadge(risk) {
    const r = (risk || 'low').toLowerCase();
    let badgeClass = 'badge-low';
    let iconSvg = '';

    switch (r) {
      case 'critical':
        badgeClass = 'badge-critical';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm7.25-4a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0V4Zm.75 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>`;
        break;
      case 'high':
        badgeClass = 'badge-high';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 1.754a.75.75 0 0 0-1.44 0L1.18 13.504A.75.75 0 0 0 1.899 14.5h12.202a.75.75 0 0 0 .72-1.004L8.22 1.754ZM8 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>`;
        break;
      case 'medium':
        badgeClass = 'badge-medium';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm7.25-3.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>`;
        break;
      default:
        badgeClass = 'badge-low';
        iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>`;
    }

    return `<span class="badge ${badgeClass}" aria-label="Risk level: ${risk}">${iconSvg}<span>${risk} Risk</span></span>`;
  },

  renderStatusBadge(status) {
    const s = (status || 'investigating').toLowerCase().replace(/\s+/g, '');
    let badgeClass = 'badge-status-investigating';

    switch (s) {
      case 'investigating':
        badgeClass = 'badge-status-investigating';
        break;
      case 'planning':
        badgeClass = 'badge-status-planning';
        break;
      case 'awaitingapproval':
      case 'pendingreview':
        badgeClass = 'badge-status-awaiting';
        break;
      case 'approved':
        badgeClass = 'badge-status-approved';
        break;
      case 'inprogress':
        badgeClass = 'badge-status-inprogress';
        break;
      case 'resolved':
      case 'completed':
        badgeClass = 'badge-status-completed';
        break;
      case 'rejected':
      case 'cancelled':
        badgeClass = 'badge-status-rejected';
        break;
      default:
        badgeClass = 'badge-status-investigating';
    }

    return `<span class="badge badge-status ${badgeClass}">${status}</span>`;
  },

  renderTriggerBadge(source) {
    const isProactive = (source || 'proactive').toLowerCase() === 'proactive';
    const badgeClass = isProactive ? 'badge-source-proactive' : 'badge-source-reported';
    const label = isProactive ? 'Proactive Signal' : 'Reported Alert';
    const icon = isProactive
      ? `<svg viewBox="0 0 16 16" fill="currentColor" style="width:11px;height:11px" aria-hidden="true"><path d="M8 2a.75.75 0 0 1 .75.75v1.06a5.5 5.5 0 0 1 4.44 4.44h1.06a.75.75 0 0 1 0 1.5h-1.06a5.5 5.5 0 0 1-4.44 4.44v1.06a.75.75 0 0 1-1.5 0v-1.06a5.5 5.5 0 0 1-4.44-4.44H1.75a.75.75 0 0 1 0-1.5h1.06a5.5 5.5 0 0 1 4.44-4.44V2.75A.75.75 0 0 1 8 2Zm0 3.5A3.5 3.5 0 1 0 8 12.5a3.5 3.5 0 0 0 0-7Z"/></svg>`
      : `<svg viewBox="0 0 16 16" fill="currentColor" style="width:11px;height:11px" aria-hidden="true"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11Zm0 1.5h11a.5.5 0 0 1 .5.5v.38l-6 3.75-6-3.75V5a.5.5 0 0 1 .5-.5Zm11.5 2.27v4.73a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V6.77l5.6 3.5a.75.75 0 0 0 .8 0l5.6-3.5Z"/></svg>`;

    return `<span class="badge badge-source ${badgeClass}">${icon}<span>${label}</span></span>`;
  },

  // --------------------------------------------------------------------------
  // Toast Notifications
  // --------------------------------------------------------------------------

  showToast(message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" style="width:16px;height:16px;color:var(--color-teal);flex-shrink:0"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" style="width:16px;height:16px;color:var(--color-warning);flex-shrink:0"><path fill-rule="evenodd" d="M8.22 1.754a.75.75 0 0 0-1.44 0L1.18 13.504A.75.75 0 0 0 1.899 14.5h12.202a.75.75 0 0 0 .72-1.004L8.22 1.754ZM8 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" style="width:16px;height:16px;color:var(--color-critical);flex-shrink:0"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM5.22 4.22a.75.75 0 0 1 1.06 0L8 5.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 7l1.72 1.72a.75.75 0 1 1-1.06 1.06L8 8.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L6.94 7 5.22 5.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" style="width:16px;height:16px;color:var(--color-primary);flex-shrink:0"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm7.25-3.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },

  // --------------------------------------------------------------------------
  // Accessible Modal Management
  // --------------------------------------------------------------------------

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Focus first input or button
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
    }

    // Add Escape key listener
    modal._escHandler = (e) => {
      if (e.key === 'Escape') {
        App.closeModal(modalId);
      }
    };
    window.addEventListener('keydown', modal._escHandler);
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    if (modal._escHandler) {
      window.removeEventListener('keydown', modal._escHandler);
      modal._escHandler = null;
    }
  }
};

window.App = App;
