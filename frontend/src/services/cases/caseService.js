/**
 * SupplyGuard Case Service Layer
 * Supports both offline mock adapter and future real backend endpoints.
 */
import { apiClient, isLiveBackendConfigured } from '../api/client.js';
import { loadMockState, saveMockState, resetMockState } from '../../data/mock/storage.js';

const delay = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardSummary() {
  if (isLiveBackendConfigured) {
    const live = await apiClient('/dashboard/summary');
    if (live) return live;
  }

  await delay(50);
  const state = loadMockState();
  const activeCases = state.cases.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed');
  const highRisk = activeCases.filter((c) => c.risk === 'Critical' || c.risk === 'High');
  const awaitingApproval = activeCases.filter(
    (c) => c.approval?.status === 'Pending Review' || c.approval?.status === 'Awaiting Approval'
  );

  const riskDistribution = {
    critical: activeCases.filter((c) => c.risk === 'Critical').length,
    high: activeCases.filter((c) => c.risk === 'High').length,
    medium: activeCases.filter((c) => c.risk === 'Medium').length,
    low: activeCases.filter((c) => c.risk === 'Low').length,
  };

  return {
    activeDisruptions: activeCases.length,
    highRiskCases: highRisk.length,
    productsAtRisk: 14 + (activeCases.length - 4),
    casesAwaitingApproval: awaitingApproval.length,
    lastRefreshed: state.summary.lastRefreshed,
    riskTrend: state.summary.riskTrend,
    riskDistribution,
  };
}

export async function getCases(filters = {}) {
  if (isLiveBackendConfigured) {
    const query = new URLSearchParams(filters).toString();
    const live = await apiClient(`/cases?${query}`);
    if (live) return live;
  }

  await delay(60);
  const state = loadMockState();
  let result = [...state.cases];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.supplier?.name.toLowerCase().includes(q) ||
        c.product?.name.toLowerCase().includes(q) ||
        c.product?.sku.toLowerCase().includes(q) ||
        c.impactAssessment?.locations?.some((l) => l.name.toLowerCase().includes(q))
    );
  }

  if (filters.risk && filters.risk !== 'All') {
    result = result.filter((c) => c.risk.toLowerCase() === filters.risk.toLowerCase());
  }

  if (filters.status && filters.status !== 'All') {
    result = result.filter(
      (c) => c.status.toLowerCase().replace(/\s+/g, '') === filters.status.toLowerCase().replace(/\s+/g, '')
    );
  }

  if (filters.disruptionType && filters.disruptionType !== 'All') {
    result = result.filter(
      (c) => c.disruptionType.toLowerCase() === filters.disruptionType.toLowerCase()
    );
  }

  if (filters.triggerSource && filters.triggerSource !== 'All') {
    result = result.filter(
      (c) => c.triggerSource.toLowerCase() === filters.triggerSource.toLowerCase()
    );
  }

  if (filters.sortBy) {
    const priority = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    if (filters.sortBy === 'risk') {
      result.sort((a, b) => priority[b.risk] - priority[a.risk]);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
  } else {
    const priority = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    result.sort((a, b) => priority[b.risk] - priority[a.risk] || new Date(b.createdAt) - new Date(a.createdAt));
  }

  return result;
}

export async function getCaseById(caseId) {
  if (isLiveBackendConfigured) {
    const live = await apiClient(`/cases/${caseId}`);
    if (live) return live;
  }

  await delay(40);
  const state = loadMockState();
  const found = state.cases.find((c) => c.id === caseId);
  if (!found) {
    throw new Error(`Case ${caseId} not found.`);
  }
  return JSON.parse(JSON.stringify(found));
}

export async function createCase(reportData) {
  if (isLiveBackendConfigured) {
    const live = await apiClient('/cases', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
    if (live) return live;
  }

  await delay(90);
  const state = loadMockState();
  const newNum = state.cases.length + 1;
  const caseId = `SC-2026-00${newNum}`;
  const now = new Date().toISOString();

  const newCase = {
    id: caseId,
    title: reportData.title || `${reportData.disruptionType} - ${reportData.supplierName || 'Reported Incident'}`,
    disruptionType: reportData.disruptionType || 'Supplier Delay',
    risk: reportData.risk || 'Medium',
    status: 'Investigating',
    triggerSource: 'Reported',
    createdAt: now,
    updatedAt: now,
    supplier: {
      id: `SUP-${Math.floor(500 + Math.random() * 500)}`,
      name: reportData.supplierName || 'Unspecified Supplier',
      country: 'United States',
      tier: 'Tier 2 Commercial',
      reliabilityScore: '91.0%',
    },
    shipment: {
      id: reportData.shipmentRef || `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
      carrier: reportData.carrierName || 'Regional Motor Freight',
      poNumber: reportData.poNumber || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      origin: reportData.origin || 'Supplier Facility',
      destination: reportData.locationName || 'Metro Central DC',
      originalEta: now,
      revisedEta: new Date(Date.now() + (parseInt(reportData.delayDays, 10) || 3) * 86400000).toISOString(),
      delayDays: parseInt(reportData.delayDays, 10) || 3,
      shippedQuantity: parseInt(reportData.quantity, 10) || 5000,
      unit: 'units',
    },
    product: {
      sku: reportData.sku || 'SKU-REP-900',
      name: reportData.productName || 'Reported Inventory Item',
      category: 'General Merchandising',
      unitCost: 4.5,
      retailPrice: 8.99,
      shelfLifeDays: 180,
    },
    summary: {
      headline: reportData.description || 'User-reported operational disruption pending verification.',
      whatHappened: reportData.description || 'Incident submitted via operations alert intake.',
      knownFacts: [
        `User report filed at ${new Date().toLocaleTimeString()} by operations operator.`,
        `Incident reference: ${reportData.shipmentRef || 'None provided'}.`,
      ],
      unverifiedClaims: [
        'Initial incident report claims delay duration and product quantity. Requires primary carrier EDI / sensor verification.',
      ],
      urgency: reportData.risk === 'Critical' ? 'Immediate triage required' : 'Review within normal shift schedule',
    },
    impactAssessment: {
      productSku: reportData.sku || 'SKU-REP-900',
      totalUnitsDelayed: parseInt(reportData.quantity, 10) || 5000,
      estimatedTotalShortage: Math.round((parseInt(reportData.quantity, 10) || 5000) * 0.4),
      financialRiskExposure: Math.round((parseInt(reportData.quantity, 10) || 5000) * 4.5),
      lastVerifiedTimestamp: now,
      locations: [
        {
          id: 'LOC-REP-1',
          name: reportData.locationName || 'Metro Central DC',
          role: 'Receiving Hub',
          onHand: 2400,
          safetyStock: 3000,
          dailyDemand: 600,
          daysCoverage: 4.0,
          coverageStatus: 'Pending Intake Verification',
          stockoutProjectedDate: new Date(Date.now() + 4 * 86400000).toISOString(),
          transferAvailableUnits: 0,
        },
      ],
      calculationAssumptions: ['Initial estimate generated using standard 600 units/day category run rate.'],
    },
    evidence: [
      {
        id: `EV-REP-${Date.now().toString().slice(-4)}`,
        source: 'User Disruption Intake Form',
        type: 'Operator Alert Submission',
        timestamp: now,
        verificationState: 'Unverified',
        summary: reportData.description || 'Initial report submitted via control center alert intake.',
        confidence: 'Low',
        documentRef: reportData.evidenceRef || 'USER_REPORT_SUBMISSION.txt',
      },
    ],
    agentTasks: [
      {
        id: `TASK-${Date.now().toString().slice(-4)}`,
        agent: 'Coordinator',
        title: 'Intake Ingestion & Verification Dispatch',
        status: 'Running',
        startTime: now,
        endTime: null,
        finding: 'Alert intake acknowledged. Initializing automated carrier EDI 214 ping.',
        evidenceRefs: [`EV-REP-${Date.now().toString().slice(-4)}`],
        missingInfo: 'Carrier electronic tracking manifest',
      },
    ],
    recoveryOptions: [
      {
        id: `OPT-${Date.now().toString().slice(-3)}`,
        name: 'Stage Expedited Secondary Sourcing Inquiry',
        type: 'Alternative Supplier',
        leadTimeHours: 48,
        leadTimeDisplay: '48 hours',
        estimatedCost: 2200,
        shortageReductionPct: 80,
        unitsRecovered: 3000,
        feasibility: 'Needs Verification',
        capacityConstraints: 'Requires verification of vendor production queue.',
        risksAndAssumptions: 'Preliminary rough-order-of-magnitude estimate.',
        supportingEvidence: [],
        isRecommended: true,
      },
    ],
    recommendation: {
      recommendedOptionId: `OPT-${Date.now().toString().slice(-3)}`,
      title: 'Complete Carrier Verification & Probe Backup Vendors',
      rationale: 'Verify the reported delivery lag before committing capital to emergency procurement.',
      tradeoffs: 'Conserves budget pending hard electronic confirmation.',
      uncertainty: 'Incident relies on unverified manual alert submission.',
      evidenceRefs: [],
    },
    approval: {
      status: 'Pending Review',
      decision: null,
      approverName: null,
      timestamp: null,
      notes: null,
    },
    outcome: {
      executionStatus: 'Not Started',
      resolutionState: 'Unresolved',
      actualCost: null,
      actualUnitsRecovered: null,
      actualStockoutHours: null,
      updatedAt: null,
      notes: 'Newly reported disruption awaiting initial verification.',
    },
  };

  state.cases.unshift(newCase);

  // Append audit event
  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: newCase.id,
    eventType: 'Case Reported',
    actorType: 'Human',
    actorName: 'Operations Manager',
    summary: `Manual alert submitted: ${newCase.title}. Verification state: Unverified.`,
    diff: `Created ${newCase.id} with risk ${newCase.risk}.`,
  });

  saveMockState(state);
  return newCase;
}

export async function refreshAssessment(caseId) {
  if (isLiveBackendConfigured) {
    const live = await apiClient(`/cases/${caseId}/refresh`, { method: 'POST' });
    if (live) return live;
  }

  await delay(100);
  const state = loadMockState();
  const c = state.cases.find((item) => item.id === caseId);
  if (!c) throw new Error(`Case ${caseId} not found`);

  const now = new Date().toISOString();
  c.updatedAt = now;
  c.impactAssessment.lastVerifiedTimestamp = now;

  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: c.id,
    eventType: 'Assessment Refreshed',
    actorType: 'Agent',
    actorName: 'Impact Assessor',
    summary: `Deterministic calculations recalculated stock runway against latest inventory transactions.`,
    diff: `Updated timestamp to ${new Date().toLocaleTimeString()}.`,
  });

  saveMockState(state);
  return JSON.parse(JSON.stringify(c));
}

export async function requestInvestigation(caseId, instruction) {
  if (isLiveBackendConfigured) {
    const live = await apiClient(`/cases/${caseId}/investigate`, {
      method: 'POST',
      body: JSON.stringify({ instruction }),
    });
    if (live) return live;
  }

  await delay(80);
  const state = loadMockState();
  const c = state.cases.find((item) => item.id === caseId);
  if (!c) throw new Error(`Case ${caseId} not found`);

  const now = new Date().toISOString();
  const newTask = {
    id: `TASK-${Date.now().toString().slice(-4)}`,
    agent: 'Disruption Investigator',
    title: `Supplemental Inquiry: ${instruction.slice(0, 50)}...`,
    status: 'Running',
    startTime: now,
    endTime: null,
    finding: `Initiated supplemental query: "${instruction}". Querying secondary vendor catalogs and freight lane rates.`,
    evidenceRefs: [],
    missingInfo: 'Awaiting supplier confirmation',
  };

  c.agentTasks.unshift(newTask);
  c.updatedAt = now;
  if (c.approval) {
    c.approval.status = 'More Investigation Requested';
  }

  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: c.id,
    eventType: 'Investigation Requested',
    actorType: 'Human',
    actorName: 'Operations Manager',
    summary: `Operator requested supplemental investigation: "${instruction}".`,
    diff: `Added task ${newTask.id}.`,
  });

  saveMockState(state);
  return JSON.parse(JSON.stringify(c));
}

export async function addEvidence(caseId, evidenceData) {
  if (isLiveBackendConfigured) {
    const live = await apiClient(`/cases/${caseId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(evidenceData),
    });
    if (live) return live;
  }

  await delay(70);
  const state = loadMockState();
  const c = state.cases.find((item) => item.id === caseId);
  if (!c) throw new Error(`Case ${caseId} not found`);

  const now = new Date().toISOString();
  const newEvidence = {
    id: `EV-${Date.now().toString().slice(-4)}`,
    source: evidenceData.source || 'Manual User Upload',
    type: evidenceData.type || 'Documentary Evidence',
    timestamp: now,
    verificationState: evidenceData.verificationState || 'Unverified',
    summary: evidenceData.summary || 'Supporting documentation uploaded by operations operator.',
    confidence: evidenceData.confidence || 'Medium',
    documentRef: evidenceData.documentRef || 'ATTACHED_EVIDENCE.pdf',
  };

  c.evidence.unshift(newEvidence);
  c.updatedAt = now;

  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: c.id,
    eventType: 'Evidence Appended',
    actorType: 'Human',
    actorName: 'Operations Operator',
    summary: `Attached evidence ${newEvidence.id} (${newEvidence.source}) with state: ${newEvidence.verificationState}.`,
    diff: 'Appended evidence item.',
  });

  saveMockState(state);
  return newEvidence;
}

export async function submitApproval(caseId, { decision, approverName, notes }) {
  if (isLiveBackendConfigured) {
    const live = await apiClient(`/cases/${caseId}/approval`, {
      method: 'POST',
      body: JSON.stringify({ decision, approverName, notes }),
    });
    if (live) return live;
  }

  await delay(100);
  const state = loadMockState();
  const c = state.cases.find((item) => item.id === caseId);
  if (!c) throw new Error(`Case ${caseId} not found`);

  const now = new Date().toISOString();
  c.approval = {
    status: decision === 'approve' ? 'Approved' : decision === 'reject' ? 'Rejected' : 'More Investigation Requested',
    decision: decision === 'approve' ? 'Approved' : decision === 'reject' ? 'Rejected' : 'Investigation Requested',
    approverName: approverName || 'Alex Morgan (Ops Lead)',
    timestamp: now,
    notes: notes || 'No comment provided.',
  };

  if (decision === 'approve') {
    c.status = 'Approved';
    c.outcome.executionStatus = 'In Progress';
    c.outcome.updatedAt = now;
    c.outcome.notes = `Plan authorized by ${c.approval.approverName}. Dedicated dispatch initiated in demo mode.`;
  } else if (decision === 'reject') {
    c.status = 'Planning';
    c.outcome.executionStatus = 'Cancelled';
    c.outcome.updatedAt = now;
    c.outcome.notes = `Plan rejected by ${c.approval.approverName}. Additional alternatives required.`;
  } else {
    c.status = 'Investigating';
  }

  c.updatedAt = now;

  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: c.id,
    eventType: 'Decision Recorded',
    actorType: 'Human',
    actorName: c.approval.approverName,
    summary: `Recorded ${decision.toUpperCase()} decision on recommendation. Comment: "${notes || 'None'}".`,
    diff: `Approval: ${c.approval.status}, Case Status: ${c.status}.`,
  });

  saveMockState(state);
  return JSON.parse(JSON.stringify(c));
}

export async function updateOutcome(caseId, payload) {
  if (isLiveBackendConfigured) {
    const live = await apiClient(`/cases/${caseId}/outcome`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (live) return live;
  }

  await delay(70);
  const state = loadMockState();
  const c = state.cases.find((item) => item.id === caseId);
  if (!c) throw new Error(`Case ${caseId} not found`);

  const now = new Date().toISOString();
  c.outcome.executionStatus = payload.executionStatus || c.outcome.executionStatus;
  c.outcome.notes = payload.notes || c.outcome.notes;
  c.outcome.updatedAt = now;
  if (payload.actualCost !== undefined && payload.actualCost !== null) c.outcome.actualCost = payload.actualCost;
  if (payload.actualUnitsRecovered !== undefined && payload.actualUnitsRecovered !== null) {
    c.outcome.actualUnitsRecovered = payload.actualUnitsRecovered;
  }
  if (payload.resolutionState) c.outcome.resolutionState = payload.resolutionState;

  if (payload.executionStatus === 'Completed') {
    c.status = 'Resolved';
    c.outcome.resolutionState = 'Resolved';
  }

  c.updatedAt = now;

  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: c.id,
    eventType: 'Outcome Updated',
    actorType: 'Human',
    actorName: 'Operations Manager',
    summary: `Updated execution outcome: ${c.outcome.executionStatus}. ${payload.notes || ''}`,
    diff: `Execution Status: ${c.outcome.executionStatus}.`,
  });

  saveMockState(state);
  return JSON.parse(JSON.stringify(c));
}

export async function resetDemoData() {
  const clean = resetMockState();
  return { success: true, message: 'Demo data restored to initial baseline.', data: clean };
}
