# SupplyGuard Frontend

See [root README.md](../README.md) for full architecture and execution guidelines.

### Files
- `index.html`: Phase 1 Landing Page.
- `dashboard.html`: Phase 2 Multi-View Operations Control Center.
- `css/tokens.css`: Design tokens and color system.
- `css/global.css`: Global base styles and accessible resets.
- `css/components.css`: Buttons, badges, trust pills, metric cards, modals, and toasts.
- `css/landing.css`: Landing hero and preview styles.
- `css/dashboard.css`: Dashboard sidebar, workspace tabs, and comparison matrix.
- `js/mock-data.js`: Authoritative initial seed state and canonical scenario `SC-2026-001`.
- `js/api-service.js`: Asynchronous service layer with localStorage persistence.
- `js/app.js`: Global formatting, trust badge rendering, and modal controllers.
- `js/navigation.js`: Keyboard navigation shortcuts.
- `js/landing.js`: Landing page interactive preview.
- `js/dashboard.js`: Dashboard router and overview stats.
- `js/cases.js`: Disruption cases filterable ledger.
- `js/case-detail.js`: 7-tab investigation workspace controller.
- `js/monitoring.js`: Proactive signals and disruption intake.
- `js/recovery-plans.js`: Enterprise recovery plans controller.
- `js/audit-log.js`: Audit ledger controller.
