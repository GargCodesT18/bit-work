# SupplyGuard — Modern React Frontend

> **Retail Supply-Chain Disruption Management Control Center**  
> Enterprise decision-support workspace for operations managers.

---

## 1. Purpose

SupplyGuard is an operations control room for retail supply-chain teams. Unlike a generic chatbot or static mockup, SupplyGuard provides transparent, evidence-backed decision support:
- **What disruption is occurring?** (Carrier EDI delay, cold-chain temperature excursion, rail corridor strike, demand spike)
- **What products and locations are affected?** (Differential inventory tracking across distribution centers and regional depots)
- **What is the stockout runway?** (Days of coverage, projected stockout countdowns)
- **Why do we believe this?** (6-state data trust model: Verified Fact, Estimate, Assumption, Unknown, Stale Data, Conflicting Evidence)
- **What recovery options exist?** (Inter-warehouse transfer, expedited air charter, cluster rebalancing, baseline monitoring)
- **What does the human need to approve?** (Explicit human-in-the-loop authorization with compliance audit tracking)
- **Did the recovery action work?** (Post-approval dispatch milestone progression)

---

## 2. Architecture & Design Principles

```
React UI (Components & Pages)
        │
   Custom Hooks & Context (useWorkspace, useToast)
        │
   Domain Services (caseService, monitoringService, recoveryService, auditService)
        │
   API Client Facade (apiClient, isLiveBackendConfigured)
        ├── If VITE_API_BASE_URL is set ──► Live Backend REST API
        └── If VITE_API_BASE_URL is empty ─► Offline Mock Adapter (localStorage)
```

- **Clean Boundary**: React components NEVER execute raw HTTP calls or import mock seed data directly. All calls flow through the service layer.
- **Enterprise Design System**: Custom tokens (`tokens.css`), high contrast, deep navy (`#14233B`), neutral background (`#F5F7FB`), clear trust state pills, and responsive layout.
- **Purposeful GSAP Animations**: Used selectively for stockout runway bar transitions (`RunwayBar.jsx`), approval decision stamps, and telemetry signal pulses.

---

## 3. Technology Stack & Dependency Rationale

| Package | Version | Rationale |
| :--- | :--- | :--- |
| **`react` & `react-dom`** | `^18.3.1` | Modern declarative UI component model with strict mode compliance. |
| **`react-router-dom`** | `^6.28.0` | Client-side routing, nested layouts, and URL deep-linking support (`/disruptions/:caseId`). |
| **`gsap` & `@gsap/react`** | `^3.12.5` / `^2.1.1` | High-performance animation engine for functional runway reveals and state transitions. |
| **`lucide-react`** | `^0.460.0` | Lightweight, accessible, and consistent SVG enterprise icon primitives. |
| **`vite` & `@vitejs/plugin-react`** | `^5.4.11` / `^4.3.4` | Ultra-fast local development HMR and production bundle optimization. |

*No heavy UI component libraries (such as MUI or AntD) or unnecessary utility packages were added, keeping the application lightweight, fast, and fully customizable.*

---

## 4. Folder Structure

```text
react-frontend/
├── public/                    # Static public assets
├── src/
│   ├── assets/                # Brand graphics & icons
│   ├── components/
│   │   ├── common/            # TrustBadge, RiskBadge, StatusBadge, MetricCard, RunwayBar, Modal, etc.
│   │   └── layout/            # Sidebar, Topbar, AppShell
│   ├── context/               # WorkspaceContext, ToastContext
│   ├── data/
│   │   └── mock/              # Canonical scenario (SC-2026-001) & storage adapter
│   ├── pages/
│   │   ├── control-center/    # Executive KPI cards, trend chart, risk distribution
│   │   ├── disruptions/       # Cases catalog with multi-filters and sorting
│   │   ├── case-workspace/    # 7-Tab deep investigation workspace
│   │   ├── monitoring/        # Proactive signal listener & alert intake modal
│   │   ├── network/           # Supply network nodes & inventory runways
│   │   ├── recovery/          # Enterprise recovery plans ledger
│   │   ├── audit/             # Chronological append-only compliance audit trail
│   │   └── settings/          # Telemetry endpoints & demo state reset
│   ├── services/
│   │   ├── api/               # API client facade checking VITE_API_BASE_URL
│   │   ├── cases/             # Case operations & approvals
│   │   ├── monitoring/        # Telemetry feeds & signal simulation
│   │   ├── recovery/          # Recovery options aggregator
│   │   └── audit/             # Audit event append & querying
│   ├── styles/
│   │   ├── tokens.css         # Color palette, spacing, typography tokens
│   │   ├── globals.css        # Resets, tables, buttons, cards, utilities
│   │   └── animations.css     # Keyframes and reduced-motion handling
│   ├── utils/
│   │   └── formatters.js      # Currency, number, and UTC date formatters
│   ├── App.jsx                # Application router configuration
│   └── main.jsx               # Application root mount point
├── .env.example               # Environment variables template
├── .gitignore                 # Local Git ignore rules
├── index.html                 # HTML shell
├── package.json               # Dependencies & scripts
└── vite.config.js             # Vite configuration
```

---

## 5. Local Setup & Execution

All commands must be run from within `D:\BIOS\bit-work\react-frontend`:

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will launch at: [http://localhost:5173/](http://localhost:5173/)

### Build Production Bundle
```bash
npm run build
```
The optimized production bundle is output to `dist/`.

### Preview Production Build
```bash
npm run preview
```

---

## 6. How to Connect the Real Backend

The frontend is ready for backend integration with zero component refactoring:

1. Create a `.env.local` file inside `react-frontend/`:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
2. When `VITE_API_BASE_URL` is set, `apiClient` automatically sends HTTP requests to your teammate's backend endpoints:
   - `GET /api/dashboard/summary`
   - `GET /api/cases`
   - `GET /api/cases/:caseId`
   - `POST /api/cases`
   - `POST /api/cases/:caseId/investigate`
   - `POST /api/cases/:caseId/evidence`
   - `POST /api/cases/:caseId/approval`
   - `PATCH /api/cases/:caseId/outcome`
   - `GET /api/monitoring`
   - `GET /api/recovery-plans`
   - `GET /api/audit-events`
3. If `VITE_API_BASE_URL` is left empty or omitted, SupplyGuard automatically falls back to the self-contained offline mock adapter with browser `localStorage` persistence.
