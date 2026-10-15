/**
 * SupplyGuard API Service Layer
 * Abstracts data storage behind asynchronous Promise interfaces.
 * Uses localStorage persistence so changes survive page reloads.
 */

class ApiService {
  constructor() {
    this.STORAGE_KEY = 'supplyguard_demo_state_v1';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load SupplyGuard state from localStorage:', e);
    }
    // Deep clone initial seed data
    const seed = (typeof window !== 'undefined' && window.INITIAL_MOCK_DATA) || 
                 (typeof global !== 'undefined' && global.INITIAL_MOCK_DATA) || 
                 (typeof INITIAL_MOCK_DATA !== 'undefined' ? INITIAL_MOCK_DATA : {});
    return JSON.parse(JSON.stringify(seed));
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  resetDemoData() {
    const seed = (typeof window !== 'undefined' && window.INITIAL_MOCK_DATA) || 
                 (typeof global !== 'undefined' && global.INITIAL_MOCK_DATA) || 
                 (typeof INITIAL_MOCK_DATA !== 'undefined' ? INITIAL_MOCK_DATA : {});
    this.state = JSON.parse(JSON.stringify(seed));
    this.saveState();
    return Promise.resolve({ success: true, message: 'Demo data reset to initial baseline.' });
  }

  // Helper to simulate slight async network latency
  delay(ms = 60) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --------------------------------------------------------------------------
  // Summary & Overview
  // --------------------------------------------------------------------------

  async getDashboardSummary() {
    await this.delay(50);
    // Recalculate dynamic counts
    const activeCases = this.state.cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
    const highRisk = activeCases.filter(c => c.risk === 'Critical' || c.risk === 'High');
    const awaitingApproval = activeCases.filter(c => c.approval?.status === 'Pending Review' || c.approval?.status === 'Awaiting Approval');
    
    const riskDistribution = {
      critical: activeCases.filter(c => c.risk === 'Critical').length,
      high: activeCases.filter(c => c.risk === 'High').length,
      medium: activeCases.filter(c => c.risk === 'Medium').length,
      low: activeCases.filter(c => c.risk === 'Low').length
    };

    return {
      activeDisruptions: activeCases.length,
      highRiskCases: highRisk.length,
      productsAtRisk: 14 + (activeCases.length - 4),
      casesAwaitingApproval: awaitingApproval.length,
      lastRefreshed: this.state.summary.lastRefreshed,
      riskTrend: this.state.summary.riskTrend,
      riskDistribution: riskDistribution
    };
  }

  // --------------------------------------------------------------------------
  // Disruption Cases
  // --------------------------------------------------------------------------

  async getCases(filters = {}) {
    await this.delay(60);
    let result = [...this.state.cases];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.supplier.name.toLowerCase().includes(q) ||
        c.product.name.toLowerCase().includes(q) ||
        c.product.sku.toLowerCase().includes(q) ||
        c.impactAssessment.locations.some(l => l.name.toLowerCase().includes(q))
      );
    }

    if (filters.risk && filters.risk !== 'All') {
      result = result.filter(c => c.risk.toLowerCase() === filters.risk.toLowerCase());
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter(c => c.status.toLowerCase().replace(/\s+/g, '') === filters.status.toLowerCase().replace(/\s+/g, ''));
    }

    if (filters.disruptionType && filters.disruptionType !== 'All') {
      result = result.filter(c => c.disruptionType.toLowerCase() === filters.disruptionType.toLowerCase());
    }

    if (filters.triggerSource && filters.triggerSource !== 'All') {
      result = result.filter(c => c.triggerSource.toLowerCase() === filters.triggerSource.toLowerCase());
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'risk') {
        const priority = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        result.sort((a, b) => priority[b.risk] - priority[a.risk]);
      } else if (filters.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filters.sortBy === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
    } else {
      // Default: High risk first, then newest
      const priority = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      result.sort((a, b) => priority[b.risk] - priority[a.risk] || new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  async getCaseById(caseId) {
    await this.delay(40);
    const found = this.state.cases.find(c => c.id === caseId);
    if (!found) {
      throw new Error(`Case ${caseId} not found.`);
    }
    return JSON.parse(JSON.stringify(found));
  }

  async createCase(reportData) {
    await this.delay(100);
    // Generate sequential ID
    const newNum = this.state.cases.length + 1;
    const caseId = `SC-2026-00${newNum}`;
    const now = new Date().toISOString();

    const newCase = {
      id: caseId,
      title: reportData.title || `${reportData.disruptionType} - ${reportData.supplierName || 'Reported Incident'}`,
      disruptionType: reportData.disruptionType || 'Supplier Delay',
      risk: reportData.risk || 'Medium',
      status: 'Investigating',
      triggerSource: 'Reported', // User reported
      createdAt: now,
      updatedAt: now,
      supplier: {
        id: `SUP-${Math.floor(500 + Math.random() * 500)}`,
        name: reportData.supplierName || 'Unspecified Supplier',
        country: 'United States',
        tier: 'Tier 2 Commercial',
        reliabilityScore: '91.0%'
      },
      shipment: {
        id: reportData.shipmentRef || `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
        carrier: reportData.carrierName || 'Regional Motor Freight',
        poNumber: reportData.poNumber || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        origin: reportData.origin || 'Supplier Facility',
        destination: reportData.locationName || 'Metro Central DC',
        originalEta: now,
        revisedEta: new Date(Date.now() + (parseInt(reportData.delayDays) || 3) * 86400000).toISOString(),
        delayDays: parseInt(reportData.delayDays) || 3,
        shippedQuantity: parseInt(reportData.quantity) || 5000,
        unit: 'units'
      },
      product: {
        sku: reportData.sku || 'SKU-REP-900',
        name: reportData.productName || 'Reported Inventory Item',
        category: 'General Merchandising',
        unitCost: 4.50,
        retailPrice: 8.99,
        shelfLifeDays: 180
      },
      summary: {
        headline: reportData.description || 'User-reported operational disruption pending verification.',
        whatHappened: reportData.description || 'Incident submitted via operations alert intake.',
        knownFacts: [
          `User report filed at ${new Date().toLocaleTimeString()} by operations operator.`,
          `Incident reference: ${reportData.shipmentRef || 'None provided'}.`
        ],
        unverifiedClaims: [
          'Initial incident report claims delay duration and product quantity. Requires primary carrier EDI / sensor verification.'
        ],
        urgency: reportData.risk === 'Critical' ? 'Immediate triage required' : 'Review within normal shift schedule'
      },
      impactAssessment: {
        productSku: reportData.sku || 'SKU-REP-900',
        totalUnitsDelayed: parseInt(reportData.quantity) || 5000,
        estimatedTotalShortage: Math.round((parseInt(reportData.quantity) || 5000) * 0.4),
        financialRiskExposure: Math.round((parseInt(reportData.quantity) || 5000) * 4.5),
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
            transferAvailableUnits: 0
          }
        ],
        calculationAssumptions: ['Initial estimate generated using standard 600 units/day category run rate.']
      },
      evidence: [
        {
          id: `EV-REP-${Date.now().toString().slice(-4)}`,
          source: 'User Disruption Intake Form',
          type: 'Operator Alert Submission',
          timestamp: now,
          verificationState: 'Unverified', // Crucial rule: Never mark user-submitted reports verified automatically
          summary: reportData.description || 'Initial report submitted via control center alert intake.',
          confidence: 'Low',
          documentRef: reportData.evidenceRef || 'USER_REPORT_SUBMISSION.txt'
        }
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
          missingInfo: 'Carrier electronic tracking manifest'
        }
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
          isRecommended: true
        }
      ],
      recommendation: {
        recommendedOptionId: `OPT-${Date.now().toString().slice(-3)}`,
        title: 'Complete Carrier Verification & Probe Backup Vendors',
        rationale: 'Verify the reported delivery lag before committing capital to emergency procurement.',
        tradeoffs: 'Conserves budget pending hard electronic confirmation.',
        uncertainty: 'Incident relies on unverified manual alert submission.',
        evidenceRefs: []
      },
      approval: {
        status: 'Pending Review',
        decision: null,
        approverName: null,
        timestamp: null,
        notes: null
      },
      outcome: {
        executionStatus: 'Not Started',
        resolutionState: 'Unresolved',
        actualCost: null,
        actualUnitsRecovered: null,
        actualStockoutHours: null,
        updatedAt: null,
        notes: 'Newly reported disruption awaiting initial verification.'
      }
    };

    this.state.cases.unshift(newCase);
    
    // Add audit event
    this.addAuditEvent({
      caseId: newCase.id,
      eventType: 'Case Reported',
      actorType: 'Human',
      actorName: 'Operations Manager',
      summary: `Manual alert submitted: ${newCase.title}. Verification state: Unverified.`,
      diff: `Created ${newCase.id} with risk ${newCase.risk}.`
    });

    this.saveState();
    return newCase;
  }

  async refreshAssessment(caseId) {
    await this.delay(120);
    const c = this.state.cases.find(item => item.id === caseId);
    if (!c) throw new Error(`Case ${caseId} not found`);

    const now = new Date().toISOString();
    c.updatedAt = now;
    c.impactAssessment.lastVerifiedTimestamp = now;

    this.addAuditEvent({
      caseId: c.id,
      eventType: 'Assessment Refreshed',
      actorType: 'Agent',
      actorName: 'Impact Assessor',
      summary: `Deterministic calculations recalculated stock runway against latest inventory transactions.`,
      diff: `Updated timestamp to ${new Date().toLocaleTimeString()}.`
    });

    this.saveState();
    return JSON.parse(JSON.stringify(c));
  }

  async requestMoreInvestigation(caseId, instruction) {
    await this.delay(80);
    const c = this.state.cases.find(item => item.id === caseId);
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
      missingInfo: 'Awaiting supplier confirmation'
    };

    c.agentTasks.unshift(newTask);
    c.updatedAt = now;
    if (c.approval) {
      c.approval.status = 'More Investigation Requested';
    }

    this.addAuditEvent({
      caseId: c.id,
      eventType: 'Investigation Requested',
      actorType: 'Human',
      actorName: 'Operations Manager',
      summary: `Operator requested supplemental investigation: "${instruction}".`,
      diff: `Added task ${newTask.id}.`
    });

    this.saveState();
    return JSON.parse(JSON.stringify(c));
  }

  async addEvidence(caseId, evidenceData) {
    await this.delay(70);
    const c = this.state.cases.find(item => item.id === caseId);
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
      documentRef: evidenceData.documentRef || 'UPLOADED_ATTACHMENT.pdf'
    };

    c.evidence.unshift(newEvidence);
    c.updatedAt = now;

    this.addAuditEvent({
      caseId: c.id,
      eventType: 'Evidence Appended',
      actorType: 'Human',
      actorName: 'Operations Operator',
      summary: `Attached evidence ${newEvidence.id} (${newEvidence.source}) with state: ${newEvidence.verificationState}.`,
      diff: `Appended evidence item.`
    });

    this.saveState();
    return newEvidence;
  }

  async submitApproval(caseId, { decision, approverName, notes }) {
    await this.delay(100);
    const c = this.state.cases.find(item => item.id === caseId);
    if (!c) throw new Error(`Case ${caseId} not found`);

    const now = new Date().toISOString();
    c.approval = {
      status: decision === 'approve' ? 'Approved' : (decision === 'reject' ? 'Rejected' : 'More Investigation Requested'),
      decision: decision === 'approve' ? 'Approved' : (decision === 'reject' ? 'Rejected' : 'Investigation Requested'),
      approverName: approverName || 'Alex Morgan (Ops Lead)',
      timestamp: now,
      notes: notes || 'No comment provided.'
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

    this.addAuditEvent({
      caseId: c.id,
      eventType: 'Decision Recorded',
      actorType: 'Human',
      actorName: c.approval.approverName,
      summary: `Recorded ${decision.toUpperCase()} decision on recommendation. Comment: "${notes || 'None'}".`,
      diff: `Approval: ${c.approval.status}, Case Status: ${c.status}.`
    });

    this.saveState();
    return JSON.parse(JSON.stringify(c));
  }

  async updateOutcome(caseId, { executionStatus, notes, actualCost, actualUnitsRecovered, resolutionState }) {
    await this.delay(70);
    const c = this.state.cases.find(item => item.id === caseId);
    if (!c) throw new Error(`Case ${caseId} not found`);

    const now = new Date().toISOString();
    c.outcome.executionStatus = executionStatus || c.outcome.executionStatus;
    c.outcome.notes = notes || c.outcome.notes;
    c.outcome.updatedAt = now;
    if (actualCost !== undefined && actualCost !== null) c.outcome.actualCost = actualCost;
    if (actualUnitsRecovered !== undefined && actualUnitsRecovered !== null) c.outcome.actualUnitsRecovered = actualUnitsRecovered;
    if (resolutionState) c.outcome.resolutionState = resolutionState;

    if (executionStatus === 'Completed') {
      c.status = 'Resolved';
      c.outcome.resolutionState = 'Resolved';
    }

    c.updatedAt = now;

    this.addAuditEvent({
      caseId: c.id,
      eventType: 'Outcome Updated',
      actorType: 'Human',
      actorName: 'Operations Manager',
      summary: `Updated execution outcome: ${c.outcome.executionStatus}. ${notes || ''}`,
      diff: `Execution Status: ${c.outcome.executionStatus}.`
    });

    this.saveState();
    return JSON.parse(JSON.stringify(c));
  }

  // --------------------------------------------------------------------------
  // Risk Monitoring
  // --------------------------------------------------------------------------

  async getMonitoringData() {
    await this.delay(40);
    return JSON.parse(JSON.stringify(this.state.monitoring));
  }

  async simulateSignalIngestion() {
    await this.delay(80);
    const now = new Date().toISOString();
    const newSignal = {
      id: `SIG-${Math.floor(8900 + Math.random() * 1000)}`,
      timestamp: now,
      ruleId: 'RULE-01',
      ruleName: 'Projected Stock Depletion Alert',
      entity: 'Midwest Regional Hub (WH-MW-02)',
      description: 'Cereal grains inventory runway dipped to 3.2 days (safety threshold is 4.0 days).',
      severity: 'Medium',
      linkedCaseId: null
    };

    this.state.monitoring.detectedEvents.unshift(newSignal);
    this.state.monitoring.lastEvaluation = now;
    this.state.monitoring.signalsEvaluatedToday += 14;

    this.addAuditEvent({
      caseId: 'SYSTEM',
      eventType: 'Signal Ingested',
      actorType: 'System',
      actorName: 'Automated Telemetry Listener',
      summary: `Ingested proactive alert ${newSignal.id}: ${newSignal.entity} runway breach.`,
      diff: `Generated signal ${newSignal.id}.`
    });

    this.saveState();
    return newSignal;
  }

  // --------------------------------------------------------------------------
  // Recovery Plans View
  // --------------------------------------------------------------------------

  async getRecoveryPlans() {
    await this.delay(50);
    const plans = [];
    this.state.cases.forEach(c => {
      if (c.recoveryOptions && c.recoveryOptions.length > 0) {
        c.recoveryOptions.forEach(opt => {
          plans.push({
            caseId: c.id,
            caseTitle: c.title,
            risk: c.risk,
            optionId: opt.id,
            actionName: opt.name,
            type: opt.type,
            leadTimeDisplay: opt.leadTimeDisplay,
            estimatedCost: opt.estimatedCost,
            shortageReductionPct: opt.shortageReductionPct,
            feasibility: opt.feasibility,
            isRecommended: opt.isRecommended,
            approvalState: c.recommendation?.recommendedOptionId === opt.id ? (c.approval?.status || 'Pending Review') : 'Alternative',
            executionState: c.recommendation?.recommendedOptionId === opt.id ? (c.outcome?.executionStatus || 'Not Started') : 'N/A',
            approverName: c.approval?.approverName || 'Unassigned',
            lastUpdate: c.updatedAt
          });
        });
      }
    });
    return plans;
  }

  // --------------------------------------------------------------------------
  // Audit Events
  // --------------------------------------------------------------------------

  async getAuditEvents(filters = {}) {
    await this.delay(40);
    let events = [...this.state.auditEvents];

    if (filters.caseId && filters.caseId !== 'All') {
      events = events.filter(e => e.caseId === filters.caseId);
    }
    if (filters.actorType && filters.actorType !== 'All') {
      events = events.filter(e => e.actorType.toLowerCase() === filters.actorType.toLowerCase());
    }
    if (filters.eventType && filters.eventType !== 'All') {
      events = events.filter(e => e.eventType.toLowerCase().includes(filters.eventType.toLowerCase()));
    }

    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addAuditEvent(event) {
    const newEvent = {
      id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      caseId: event.caseId || 'SYSTEM',
      eventType: event.eventType || 'System Event',
      actorType: event.actorType || 'System',
      actorName: event.actorName || 'Automated Monitor',
      summary: event.summary || 'Unspecified audit occurrence.',
      diff: event.diff || ''
    };
    this.state.auditEvents.unshift(newEvent);
    // Keep max 100 audit events in demo state
    if (this.state.auditEvents.length > 100) {
      this.state.auditEvents.pop();
    }
    return newEvent;
  }
}

// Global singleton instance
window.apiService = new ApiService();
