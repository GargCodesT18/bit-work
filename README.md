# SupplyGuard — Retail Supply-Chain Disruption Management Control Center

SupplyGuard is an operations decision-support workspace designed for retail supply-chain managers. It turns supply-chain disruption signals into transparent, evidence-backed recovery decisions.

Rather than looking like a generic conversational chatbot, SupplyGuard functions as an authoritative control center that distinguishes **verified facts**, **estimates**, **assumptions**, **unknowns**, **stale data**, and **conflicting evidence**.

---

## Product Principles & Architecture

- **Decision-Support Workspace**: Structured layout giving operators instant visibility into affected SKUs, distribution centers, days of coverage, and stockout timelines.
- **Two Ingestion Triggers**:
  - **Proactive Monitoring**: Automated telemetry listeners checking deterministic rules (e.g. stock coverage < safety threshold, carrier EDI revised ETA > PO delivery date).
  - **Alert-Driven Investigation**: Direct operator reporting of supplier delays, freight strikes, warehouse incidents, or demand surges.
- **Strict Data Integrity System**:
  - `Verified Fact`: Backed by authoritative carrier EDI, sensor telemetry, or warehouse cycle counts.
  - `Estimate`: Calculated or projected from run-rate models.
  - `Assumption`: Applied heuristics due to missing inputs.
  - `Unknown`: Uncorroborated values awaiting verification.
  - `Stale Data`: Records older than the operational freshness threshold (>4h).
  - `Conflicting Evidence`: Incompatible signals from independent sources (e.g. carrier manifest vs. satellite AIS vessel position).
- **Multi-Agent Specialist Roles**:
  - **Coordinator**: Orchestrates the case lifecycle and delegates tasks.
  - **Disruption Investigator**: Collects carrier updates and reconciles telemetry.
  - **Impact Assessor**: Calculates differential runway days and financial exposure.
  - **Recovery Planner**: Synthesizes and compares mitigation strategies.
  - **Decision Reviewer**: Checks feasibility against corporate safety-stock policy.
  - *Note*: Core calculations and compliance checks are deterministic business rules, not uncontrolled generative outputs.

---

## Canonical Demo Scenario: Case SC-2026-001

The workspace is pre-populated with mathematically consistent data modeling the core illustrative scenario:

- **Case ID**: `SC-2026-001`
- **Incident**: 4-day ocean/rail freight delay from supplier Northstar Foods.
- **Product**: Cooking Oil, 1 L (`OIL-CAN-1L`).
- **Location A (Central Distribution Center)**: Holds 14,000 units on hand; daily demand of 2,000 units = **7.0 days coverage** (healthy buffer).
- **Location B (Metro Regional Depot)**: Holds 1,200 units on hand; daily demand of 1,150 units = **1.04 days coverage** (imminent stockout within ~25 hours).
- **Recovery Options Formulated**:
  1. *Inter-Warehouse Transfer*: Move 3,500 units from Central DC to Metro Depot in 18 hours for $1,450. Relieves 92% of the shortage while leaving Central DC with 5.25 days coverage (strictly above the 4.0-day safety stock mandate). **[Recommended]**
  2. *Expedited Air Freight*: Procure 3,800 units from backup vendor Apex Dist in 24 hours for $6,800.
  3. *Store-to-Store Balancing*: Rebalance from 9 retail stores in 36 hours for $2,900.
  4. *Wait & Monitor*: Infeasible; results in 3 days of empty retail shelves and $20,366 in lost margin and penalty fees.

---

## Project Structure

```text
frontend/
├── index.html                 # Phase 1: Landing Page
├── dashboard.html             # Phase 2: Operations Dashboard Workspace
├── css/
│   ├── tokens.css             # Design tokens (colors, typography, shadows, borders)
│   ├── global.css             # Resets, accessibility utilities, typography
│   ├── components.css         # Badges, metric cards, data tables, modals, trust pills
│   ├── landing.css            # Landing page layout, hero, interactive preview, process flow
│   └── dashboard.css          # Control center layout, collapsible sidebar, tabs, matrix
├── js/
│   ├── mock-data.js           # Authoritative initial mock entities and seed state
│   ├── api-service.js         # Asynchronous Promise-based data layer with localStorage persistence
│   ├── app.js                 # Global formatting helpers, trust badges, toasts, and modal traps
│   ├── navigation.js          # Global keyboard navigation shortcuts ('/' to search)
│   ├── landing.js             # Landing page preview stage switcher and mobile menu
│   ├── dashboard.js           # Dashboard router, topbar controls, and Overview KPI cards
│   ├── cases.js               # Disruption cases list with live search, multi-filter, and sorting
│   ├── case-detail.js         # 7-tab investigation workspace (Summary, Impact, Evidence, Agents, Options, Approval, Outcome)
│   ├── monitoring.js          # Proactive monitoring listener & disruption report intake form
│   ├── recovery-plans.js      # Consolidated enterprise recovery plans ledger
│   └── audit-log.js           # Append-only chronological compliance audit stream
├── assets/                    # Icons and imagery assets
└── README.md                  # Documentation
```

---

## How to Run & Verify

The frontend is built with pure standards-based ES6+ JavaScript, CSS tokens, and semantic HTML with zero build steps or external dependencies.

### Option 1: Serve locally using Python
Run from the project root:
```bash
python -m http.server 8000
```
Then navigate to:
- **Landing Page**: [http://localhost:8000/frontend/index.html](http://localhost:8000/frontend/index.html) (or [http://localhost:8000/](http://localhost:8000/))
- **Dashboard**: [http://localhost:8000/frontend/dashboard.html](http://localhost:8000/frontend/dashboard.html)

### Option 2: Serve using Node.js
```bash
npx serve .
```

### Option 3: Direct File Open
Open `frontend/index.html` or `frontend/dashboard.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).

---

## Core Operational Journeys to Test

1. **Landing Page Tour**:
   - Inspect the interactive UI preview toggle (Disruption Signal → Impact Runway → Recovery Decision).
   - Review problem statements, 5-step operational lifecycle, and multi-agent roles.
   - Click **Open Dashboard** to transition into the control center.
2. **Dashboard Overview**:
   - Check the 4 KPI cards labeled **Demo data**.
   - Review the SVG disruption trend chart and risk distribution breakdown.
   - Click on any case to open the investigation workspace.
3. **Core Case Investigation (`SC-2026-001`)**:
   - Navigate across all 7 tabs:
     - **A. Incident Summary**: Inspect Known Facts vs. Unverified Claims.
     - **B. Impact Assessment**: Review Central DC (7.0d) vs Metro Depot (1.04d) stock runway bars and mathematical assumptions.
     - **C. Evidence Ledger**: Filter by verification state and test **Attach Supporting Evidence**.
     - **D. Agent Task Trace**: Review chronological execution findings from Coordinator, Investigator, Assessor, Planner, Reviewer.
     - **E. Recovery Options**: Compare lead time, cost, shortage relief %, and feasibility across the 4 options.
     - **F. Recommendation & Approval**: Authorize the recommended Inter-Warehouse Transfer with approver name and notes.
     - **G. Outcome Tracking**: Observe status update to `In Progress` and test milestone progression to `Completed & Resolved`.
4. **Proactive Monitoring & Alert Intake**:
   - Navigate to **Risk Monitoring**.
   - Click **Simulate Proactive Signal Ingestion** to trigger an automated telemetry alert.
   - Click **Report a Disruption**, fill out the incident form, and verify that the newly submitted case is initialized with an `Unverified` data badge and recorded in the audit log.
5. **Recovery Plans & Audit Trail**:
   - Inspect the enterprise recovery plans table.
   - Filter the audit log by actor type (Human, Agent, System) or event type.
6. **Reset State**:
   - Visit **Demo Settings** and click **Reset Demo Data** to restore the baseline state at any time.
