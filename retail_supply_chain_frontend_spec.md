# Retail Supply-Chain Disruption Management --- Frontend Specification

**Purpose:** Build the frontend in this order: **1) Landing page, 2)
Dashboard.**

**Product principle:** Help a retail operations manager understand a
disruption, identify affected products and locations, compare recovery
options, and make evidence-backed decisions. Do not make the product
look like a generic chatbot.

## 1. Product overview

The system supports two triggers: - **Proactive monitoring:** Flag
potential disruptions from supply-chain signals. - **Alert-driven
investigation:** A user reports a supplier delay, shipment issue,
warehouse incident, or other disruption.

The frontend is a decision-support workspace. It must distinguish
verified facts, estimates, assumptions, unknowns, stale data, and
conflicting evidence.

**Primary user:** Supply-chain / operations manager.

**Core journey:** Landing page → Dashboard → Open disruption case →
Review impact and evidence → Compare recovery options →
Approve/reject/request more investigation → Track outcome.

## 2. Scope and build order

### Phase 1: Landing page

Explain the problem, solution, workflow, multi-agent roles, and
benefits. Provide a clear CTA into the dashboard.

### Phase 2: Dashboard

Build overview metrics, disruption case list, monitoring and alert
intake, case investigation, evidence, agent task trace, recovery
options, approval flow, and outcome tracking.

### Out of scope for the first version

-   Real supplier/carrier integrations.
-   Real purchase-order placement or shipment rerouting.
-   Production authentication.
-   Real ML inference or RAG retrieval in the browser.
-   Autonomous execution of high-impact actions.

Use consistent, clearly labeled mock data. Keep data access behind a
service layer so APIs can replace mock data later.

## 3. Visual direction

Create a modern, professional supply-chain operations control center:
clean, trustworthy, information-dense without feeling crowded.

-   Light neutral background, deep navy text, blue primary actions.
-   Teal for healthy/verified states; amber for warnings/pending review;
    red only for critical risk/failures.
-   Subtle borders, restrained shadows, consistent spacing and
    typography.
-   Use charts only when they explain risk or trends.
-   Avoid excessive gradients, oversized rounded cards, decorative stock
    imagery, and a generic chatbot aesthetic.
-   Desktop-first, but responsive on tablets and phones.
-   Never communicate status using color alone.

### Suggested design tokens

  Token        Value       Usage
  ------------ ----------- ---------------------
  Background   `#F5F7FB`   App background
  Surface      `#FFFFFF`   Cards and panels
  Primary      `#2457D6`   Primary actions
  Navy         `#14233B`   Headings/navigation
  Teal         `#168A7A`   Healthy/verified
  Warning      `#D99022`   Warnings
  Critical     `#C84040`   High risk/failures
  Border       `#DFE5EE`   Dividers
  Muted text   `#64748B`   Secondary labels

## 4. Page One --- Landing page (`/`)

### Navigation

-   Product wordmark: **SupplyGuard** (working name; easy to rename).
-   Links: `Overview`, `How It Works`, `Capabilities`.
-   Secondary action: `Open Dashboard`.
-   Primary action: `Start an Investigation`.
-   Collapse navigation into a menu on small screens.

### Hero

**Headline:** Turn supply-chain disruptions into clear recovery
decisions.

**Supporting text:** Identify affected products and locations, assess
stockout risk, investigate recovery options, and give operations teams
evidence-backed recommendations.

-   Primary CTA: **Open Dashboard**
-   Secondary CTA: **See How It Works**
-   Visual: simple diagram or product UI preview showing alert → impact
    assessment → recovery plan. Prefer a purposeful product illustration
    over generic stock imagery.

### Problem section

Title: **A shipment delay is more than a logistics problem.**

Show three cards: 1. **Limited visibility:** An alert does not
automatically reveal every affected product, warehouse, store, or order.
2. **Uncertain impact:** Inventory, demand, and delivery estimates
change. 3. **Slow recovery decisions:** Teams need to compare transfers,
expedited shipping, and alternative suppliers.

Present these as common challenges the product is designed to address,
not as facts about every retailer.

### How it works

Show a five-step horizontal flow on desktop and vertical flow on
mobile: 1. **Detect or receive** --- Monitor supply-chain signals or
accept a reported incident. 2. **Investigate** --- Gather shipment,
supplier, and policy evidence. 3. **Assess impact** --- Identify
affected products/locations and estimate shortages. 4. **Plan recovery**
--- Compare alternatives by time, cost, and constraints. 5. **Review and
track** --- Present a recommendation for human approval and track
outcomes.

### Multi-agent workflow

Explain each role in plain language: - **Coordinator:** Manages the case
and delegates tasks. - **Disruption Investigator:** Establishes what
happened and gathers evidence. - **Impact Assessor:** Estimates affected
inventory, locations, and stockout risk. - **Recovery Planner:**
Compares possible recovery options. - **Decision Reviewer:** Checks
evidence, constraints, and approval requirements.

Some calculations and checks are deterministic services, not necessarily
separate AI agents.

### Benefits

Use four cards: - Earlier visibility into potential shortages. - Faster,
structured disruption investigation. - Better comparison of cost,
timing, and service trade-offs. - Traceable recommendations with human
approval.

Do not show unverified performance statistics, savings percentages,
customer logos, testimonials, or guarantees.

### Final CTA and footer

CTA: **See the disruption workflow in action.** Button: **Open
Dashboard** Footer links: `Project Overview`, `How It Works`,
`Dashboard`. Do not add fake social links or legal pages.

### Landing page acceptance criteria

-   A new user can quickly understand the problem and value.
-   Both proactive monitoring and alert-driven investigation are
    explained.
-   Main CTA navigates to `/dashboard`.
-   Responsive layout.
-   No unsupported performance claims.

## 5. Page Two --- Dashboard (`/dashboard`)

### Main layout

**Left sidebar** - Overview - Disruption Cases - Risk Monitoring -
Recovery Plans - Activity / Audit Log - Settings (placeholder in MVP)

**Top bar** - Page title and breadcrumb. - Search field (mock behavior
is fine initially). - Last data refresh timestamp. - Notification
indicator (mock behavior initially). - User/profile menu (visual only
until authentication exists).

Keep the sidebar collapsible.

### Overview page

At the top, show four summary cards, clearly labeled **Demo data**: -
Active Disruptions - High-Risk Cases - Products at Risk - Cases Awaiting
Approval

Add: - **Risk trend:** Sample chart with labels, date range, and empty
state. - **Risk distribution:** Critical / High / Medium / Low, with
counts and text labels. - **Active cases table:** Case ID, disruption,
supplier/route, affected products/locations, risk, detected/reported
time, status, `View Case`. - **Recent activity:** Case created, evidence
updated, assessment completed, option proposed, approval
requested/recorded.

All overview panels must use the same mock data source.

### Disruption Cases page

-   Search by case ID, supplier, product, or location.
-   Filters: risk, status, disruption type, trigger source.
-   Sort by risk, newest, oldest.
-   Table or responsive cards.
-   Empty state when no cases match.
-   Selecting a row opens case details.

### Risk Monitoring page

**Proactive monitoring** - Status marked `Demo mode` until connected to
real data. - Signals checked, last evaluation time, active risk rules. -
Example rules: projected stock below safety stock; delivery ETA later
than required date. - List of detected risk events.

**Alert-driven investigation** - Button: `Report a Disruption`. -
Fields: disruption type (supplier delay, transport disruption, warehouse
shutdown, demand spike, other); supplier/shipment reference; affected
product/location; expected delay or incident time if known; description;
evidence reference/upload placeholder. - Validate required fields. -
Submitting creates a mock case and shows confirmation. - A
user-submitted report must not be marked verified automatically.

### Case detail / investigation workspace

This is the most important dashboard view.

**Header** - Case ID and incident title. - Risk badge and status. -
Trigger source: `Proactive` or `Reported`. - Created time and last
updated time. - Actions: `Refresh Assessment`,
`Request More Investigation`, `Close Case` when appropriate.

Organize into tabs or distinct sections:

#### A. Summary

-   What happened.
-   Known facts vs. unverified claims.
-   Current risk and urgency.
-   Affected suppliers, shipments, products, warehouses, stores, orders
    where data exists.
-   Last verified data timestamp.

#### B. Impact Assessment

-   Available stock.
-   Expected demand.
-   Expected replenishment / shipment ETA.
-   Days of stock coverage.
-   Estimated shortage.
-   Affected locations and priority.
-   Calculation assumptions.
-   Distinguish estimates from verified facts.

#### C. Evidence

Each item shows source name/reference, timestamp, type, and verification
state: `Verified`, `Unverified`, `Conflicting`, `Stale`. - Link
important claims/recommendations to supporting evidence when
available. - Show an empty state when no evidence exists.

#### D. Agent Investigation Log

Chronological entries show component/agent, task, status,
start/completion time, concise finding, evidence references, and
errors/missing information. Statuses: `Pending`, `Running`, `Completed`,
`Partial`, `Failed`, `Waiting for Input`.

Do not display hidden chain-of-thought. Show concise findings, tool
results, evidence, and decision rationale only.

#### E. Recovery Options

Each option shows: - Option name: inventory transfer, expedite shipment,
alternative supplier, wait and monitor. - Estimated time to reduce
impact. - Estimated cost, if known. - Expected shortage reduction, if
known. - Capacity/availability constraints. - Risks and assumptions. -
Feasibility: `Feasible`, `Needs Verification`, `Not Feasible`. -
Supporting evidence.

Allow options to be selected and compared. Do not call an option "best"
unless the criteria and data support it.

#### F. Recommendation and approval

Show the recommended option, rationale, alternatives considered,
trade-offs, meaningful uncertainty, evidence references, and approval
status.

Buttons: - `Approve Recommendation` - `Reject` -
`Request More Investigation`

In demo mode, these buttons update mock state only and show
confirmation. Never execute a real purchase, transfer, or rerouting
action.

Record mock approver, timestamp, decision, and optional comment.

#### G. Outcome tracking

After an option is approved: - Status: `Approved`, `In Progress`,
`Completed`, `Blocked`, `Cancelled`. - Record outcome and whether the
disruption was resolved. - Allow demo status updates. - Preserve
previous decisions/events in audit history.

### Recovery Plans page

List case ID, proposed action, estimated cost/time, approval state,
execution state, owner/approver (mock), last update, and link to case.

### Activity / Audit Log page

Chronological and filterable events show timestamp, case ID, event type,
actor (agent/system/human), summary, and state/decision change. The
intended product design is append-oriented; the demo can use mock state.

## 6. Consistent mock scenario

Use one illustrative case throughout the UI:

-   **Case ID:** `SC-2026-001`
-   **Incident:** Supplier shipment delayed by 4 days.
-   **Supplier:** `Northstar Foods` (fictional demo supplier).
-   **Product:** Cooking oil, 1 L (illustrative product).
-   **Location A:** 7 days of stock coverage.
-   **Location B:** 1 day of stock coverage.
-   **Potential alternative:** Transfer stock from a second warehouse,
    subject to availability and safety-stock constraints.
-   **Case status:** `Investigating`.
-   **Risk:** `High` (illustrative classification, not a model
    prediction).

Keep values consistent. If showing unit counts, demand, ETA, or costs,
make values mathematically consistent or label them estimates. Label the
workspace **Demo data**.

Suggested mock entities: - `DisruptionCase` - `Supplier` - `Shipment` -
`Product` - `Location` - `InventorySnapshot` - `EvidenceItem` -
`AgentTask` - `RecoveryOption` - `ApprovalRecord` - `AuditEvent`

Use stable IDs and link related entities rather than duplicating
unrelated values.

## 7. Required interactions

Every visible interactive control must do something meaningful, even
when powered by mock data: - Landing CTA navigates to dashboard. -
Sidebar navigation switches pages. - Search/filters change displayed
cases. - Selecting a case opens details. - `Report a Disruption`
validates and creates a mock case. - Tabs/sections are navigable. -
Recovery options can be selected and compared. - Approve / Reject /
Request More Investigation updates demo state. - Outcome tracking
updates status and activity history. - Refresh updates a visible
timestamp or simulates refresh. - Design loading, empty, error,
partial-data, and success states.

Do not leave inert buttons that look functional.

## 8. Data integrity and trust

The interface must distinguish: - **Verified fact:** supported by an
authoritative record. - **Estimate:** calculated or predicted. -
**Assumption:** used because information is missing. - **Unknown:** no
reliable value is available. - **Stale data:** source exists but is too
old for this decision. - **Conflicting evidence:** sources disagree.

Also: - Show freshness for important inventory and shipment values. -
Explain the basis of risk labels. - Never invent citations, supplier
commitments, or live statuses. - Do not treat a user-submitted report as
verified evidence. - Do not hide missing data behind a confident
summary. - Link critical claims to evidence where available. - Require
human approval for high-impact actions.

## 9. Accessibility and usability

-   Semantic headings and controls.
-   Visible form labels and clear validation.
-   Keyboard navigation and visible focus states.
-   Adequate contrast; don't rely on color alone.
-   Accessible table headings.
-   Clear date/time formatting and relevant timezone.
-   Keyboard-accessible menus and dialogs.
-   Confirm consequential demo decisions.

## 10. Suggested project structure

Use modular HTML, CSS, and JavaScript for the first UI unless the team
decides otherwise. Keep mock data separate from rendering logic.

``` text
frontend/
├── index.html                 # Landing page
├── dashboard.html             # Dashboard entry point
├── assets/
│   ├── icons/
│   └── images/
├── css/
│   ├── tokens.css             # Colors, spacing, typography
│   ├── global.css             # Shared styles and reset
│   ├── landing.css
│   ├── dashboard.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   ├── mock-data.js
│   ├── dashboard.js
│   ├── cases.js
│   ├── case-detail.js
│   ├── monitoring.js
│   ├── recovery-plans.js
│   └── audit-log.js
└── README.md
```

Reusable UI components should include status badges, metric cards,
tables, evidence items, agent task rows, recovery option cards, and
confirmation dialogs.

## 11. Future API integration boundary

Use a small data-service layer so mock data can later be replaced
without rewriting the UI.

Proposed endpoints (not existing endpoints): -
`GET /api/dashboard/summary` - `GET /api/cases` -
`GET /api/cases/{caseId}` - `POST /api/cases` -
`POST /api/cases/{caseId}/investigate` -
`GET /api/cases/{caseId}/evidence` -
`GET /api/cases/{caseId}/recovery-options` -
`POST /api/cases/{caseId}/approval` -
`PATCH /api/recovery-plans/{planId}/status` - `GET /api/audit-events`

Align these with the backend design before integration. Never put API
keys or secrets in frontend code.

## 12. Definition of done

### Landing page

-   [ ] Responsive navigation and hero.
-   [ ] Problem, workflow, agent roles, and benefits.
-   [ ] Main CTA navigates to dashboard.
-   [ ] No invented customer claims or statistics.

### Dashboard

-   [ ] Sidebar and overview metrics.
-   [ ] Case list with search and filters.
-   [ ] Proactive monitoring and alert submission.
-   [ ] Case detail with impact, evidence, investigation log, and
    recovery options.
-   [ ] Approval controls and outcome tracking in demo mode.
-   [ ] Recovery plans and audit log.
-   [ ] Consistent mock data.

### Quality

-   [ ] Responsive and accessible controls.
-   [ ] Loading, empty, error, stale-data, and partial-result states.
-   [ ] All visible controls work.
-   [ ] Facts, estimates, assumptions, and unknowns are distinguishable.
-   [ ] No real operational action is executed from the mock frontend.

## 13. Implementation order

1.  Create design tokens, typography, buttons, badges, and cards.
2.  Build the landing page and test responsive behavior.
3.  Build dashboard navigation and overview with mock data.
4.  Build the case list and case detail workspace.
5.  Add monitoring and alert submission.
6.  Add evidence, agent trace, recovery comparison, and approval states.
7.  Add recovery plans and audit history.
8.  Test the full journey: landing → dashboard → case → investigation →
    recommendation → approval → outcome.

**Final principle:** The landing page communicates value; the dashboard
makes evidence, risk, options, and decisions easy to understand. Do not
start by building a chat interface.
