/**
 * SupplyGuard Authoritative Mock Data Seed
 * Standardized schema for Retail Supply-Chain Disruption Management
 * Core scenario: SC-2026-001 (Northstar Foods Cooking Oil delay)
 */

const INITIAL_MOCK_DATA = {
  // Global summary metrics
  summary: {
    activeDisruptions: 4,
    highRiskCases: 2,
    productsAtRisk: 14,
    casesAwaitingApproval: 2,
    lastRefreshed: new Date().toISOString(),
    riskTrend: [
      { date: '2026-10-09', detected: 3, resolved: 2 },
      { date: '2026-10-10', detected: 5, resolved: 4 },
      { date: '2026-10-11', detected: 2, resolved: 3 },
      { date: '2026-10-12', detected: 6, resolved: 3 },
      { date: '2026-10-13', detected: 4, resolved: 5 },
      { date: '2026-10-14', detected: 7, resolved: 4 },
      { date: '2026-10-15', detected: 4, resolved: 2 }
    ],
    riskDistribution: {
      critical: 1,
      high: 1,
      medium: 2,
      low: 0
    }
  },

  // Proactive Monitoring Signals & Rules
  monitoring: {
    systemStatus: 'Healthy',
    mode: 'Demo mode',
    lastEvaluation: new Date(Date.now() - 8 * 60000).toISOString(),
    signalsEvaluatedToday: 1420,
    activeRules: [
      {
        id: 'RULE-01',
        name: 'Projected Stock Depletion Alert',
        condition: 'Days of coverage < Safety stock (4.0 days)',
        scope: 'All Distribution Centers',
        status: 'Active',
        lastTriggered: '12m ago',
        triggeredCount: 4
      },
      {
        id: 'RULE-02',
        name: 'Carrier EDI Delivery Lag',
        condition: 'EDI 214 revised ETA > PO promised delivery date + 24h',
        scope: 'Inbound In-Transit POs',
        status: 'Active',
        lastTriggered: '45m ago',
        triggeredCount: 9
      },
      {
        id: 'RULE-03',
        name: 'Port Container Dwell Spike',
        condition: 'Dwell duration > 48h terminal historical benchmark',
        scope: 'Seaport Entry Gates',
        status: 'Active',
        lastTriggered: '2h ago',
        triggeredCount: 3
      },
      {
        id: 'RULE-04',
        name: 'Cold-Chain Telemetry Excursion',
        condition: 'Chilled transit temperature > 4°C for > 30 minutes',
        scope: 'Reefer Shipments & Hubs',
        status: 'Active',
        lastTriggered: '3h ago',
        triggeredCount: 1
      }
    ],
    detectedEvents: [
      {
        id: 'SIG-8812',
        timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
        ruleId: 'RULE-02',
        ruleName: 'Carrier EDI Delivery Lag',
        entity: 'SHP-8821 (Northstar Foods)',
        description: 'Vessel docked; container customs release pushed back 96 hours.',
        severity: 'High',
        linkedCaseId: 'SC-2026-001'
      },
      {
        id: 'SIG-8809',
        timestamp: new Date(Date.now() - 190 * 60000).toISOString(),
        ruleId: 'RULE-04',
        ruleName: 'Cold-Chain Telemetry Excursion',
        entity: 'WH-PAC-04 (Cascade Creamery)',
        description: 'Zone C temperature sensor breached 6.2°C for 45 minutes.',
        severity: 'Critical',
        linkedCaseId: 'SC-2026-002'
      },
      {
        id: 'SIG-8801',
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
        ruleId: 'RULE-03',
        ruleName: 'Port Container Dwell Spike',
        entity: 'Terminal 4 - Gateway West',
        description: 'Intermodal rail chassis shortage causing dwell times to exceed 54h.',
        severity: 'Medium',
        linkedCaseId: 'SC-2026-003'
      }
    ]
  },

  // Disruption Cases
  cases: [
    {
      id: 'SC-2026-001',
      title: 'Northstar Foods Cooking Oil Inbound Delay (4 Days)',
      disruptionType: 'Supplier Delay',
      risk: 'High',
      status: 'Investigating',
      triggerSource: 'Proactive',
      createdAt: '2026-10-15T07:20:00Z',
      updatedAt: '2026-10-15T10:45:00Z',
      supplier: {
        id: 'SUP-101',
        name: 'Northstar Foods',
        country: 'United States',
        tier: 'Tier 1 Strategic',
        reliabilityScore: '94.2%'
      },
      shipment: {
        id: 'SHP-8821',
        carrier: 'Pacific Swift Intermodal',
        poNumber: 'PO-9402',
        origin: 'Long Beach Container Terminal',
        destination: 'Metro Regional Depot (Depot B)',
        originalEta: '2026-10-16T14:00:00Z',
        revisedEta: '2026-10-20T18:00:00Z',
        delayDays: 4,
        shippedQuantity: 8000,
        unit: 'bottles (1 L)'
      },
      product: {
        sku: 'OIL-CAN-1L',
        name: 'Cooking Oil, 1 L Bottle',
        category: 'Pantry & Cooking Essentials',
        unitCost: 3.40,
        retailPrice: 5.99,
        shelfLifeDays: 365
      },
      summary: {
        headline: '4-day inbound ocean/rail freight delay creates critical stockout hazard for Metro Depot within 25 hours.',
        whatHappened: 'Pacific Swift Intermodal filed an EDI 214 revision delaying delivery of 8,000 units of 1L Cooking Oil to Metro Regional Depot (Depot B) by 96 hours due to intermodal rail congestion at the port terminal. Central Distribution Center holds surplus buffer, but Depot B inventory will deplete in 1.04 days.',
        knownFacts: [
          'EDI 214 revised ETA confirmed for Oct 20, 2026 (delayed 4 full days from Oct 16).',
          'Metro Regional Depot has exactly 1,200 units physically on hand as of 06:00 today.',
          'Metro Depot average daily outflow is 1,150 units/day; current coverage is ~25 hours.',
          'Central Distribution Center (DC A) currently holds 14,000 units with 7.0 days coverage.'
        ],
        unverifiedClaims: [
          'Supplier dispatcher phone claim stating "rail clearance may speed up by 24h" lacks electronic carrier confirmation.',
          'Depot B local floor buffer of 200 loose units in returns staging not yet inspected or certified saleable.'
        ],
        urgency: 'Immediate action required within 8 hours to execute stock transfer before morning delivery wave tomorrow.'
      },
      impactAssessment: {
        productSku: 'OIL-CAN-1L',
        totalUnitsDelayed: 8000,
        estimatedTotalShortage: 3400,
        financialRiskExposure: 20366.00, // Lost revenue + stockout breach fees
        lastVerifiedTimestamp: '2026-10-15T09:30:00Z',
        locations: [
          {
            id: 'LOC-A',
            name: 'Central Distribution Center (DC A)',
            role: 'Primary Hub',
            onHand: 14000,
            safetyStock: 8000,
            dailyDemand: 2000,
            daysCoverage: 7.0,
            coverageStatus: 'Healthy',
            stockoutProjectedDate: '2026-10-22',
            transferAvailableUnits: 4500
          },
          {
            id: 'LOC-B',
            name: 'Metro Regional Depot (Depot B)',
            role: 'Regional Fulfillment Depot',
            onHand: 1200,
            safetyStock: 3000,
            dailyDemand: 1150,
            daysCoverage: 1.04,
            coverageStatus: 'Critical Stockout Risk',
            stockoutProjectedDate: '2026-10-16T12:00:00Z',
            projectedStockoutHours: 25
          }
        ],
        calculationAssumptions: [
          'Assumes baseline daily consumption at Depot B remains steady at 1,150 units (historical weekday average).',
          'Assumes 0% scrap or transit breakage during transfer haul.',
          'Safety stock thresholds conform to Policy SEC-INV-2025 (minimum 4 days for regional hubs).'
        ]
      },
      evidence: [
        {
          id: 'EV-001',
          source: 'EDI 214 Status Feed (Pacific Swift)',
          type: 'Carrier EDI Document',
          timestamp: '2026-10-15T07:12:00Z',
          verificationState: 'Verified',
          summary: 'Status code AG (Delivery Appointment Deferred) issued for Container TRKU-9281902. Revised ETA: Oct 20, 2026 18:00 UTC.',
          confidence: 'High',
          documentRef: 'EDI214_TRKU9281902.json'
        },
        {
          id: 'EV-002',
          source: 'WMS Inventory Cycle Count (Depot B)',
          type: 'Warehouse Management Snapshot',
          timestamp: '2026-10-15T05:00:00Z',
          verificationState: 'Stale',
          summary: 'Physical bin count recorded 1,200 salable cases. Record is 6 hours old; pending 180 case morning pick wave verification.',
          confidence: 'Medium',
          documentRef: 'WMS_LOC_B_BIN_940.pdf'
        },
        {
          id: 'EV-003',
          source: 'Supplier Dispatch Phone Conversation',
          type: 'Verbal Communication Record',
          timestamp: '2026-10-15T08:30:00Z',
          verificationState: 'Unverified',
          summary: 'Northstar dispatch rep mentioned potential priority rail bypass that could recover 24 hours. No booking ID or rail slip provided.',
          confidence: 'Low',
          documentRef: 'CALL_LOG_20261015_0830.txt'
        },
        {
          id: 'EV-004',
          source: 'AIS Satellite Marine Traffic API',
          type: 'Third-Party Telemetry',
          timestamp: '2026-10-15T09:15:00Z',
          verificationState: 'Conflicting',
          summary: 'Vessel MSC Auriga shows anchored in Outer Anchorage Berth 12, whereas carrier manifest reported container already discharged to terminal rail ramp.',
          confidence: 'Medium',
          documentRef: 'AIS_BERTH_REPORT_MSC_AURIGA.csv'
        }
      ],
      agentTasks: [
        {
          id: 'TASK-101',
          agent: 'Coordinator',
          title: 'Disruption Ingestion & Case Initialization',
          status: 'Completed',
          startTime: '2026-10-15T07:20:00Z',
          endTime: '2026-10-15T07:22:00Z',
          finding: 'Identified PO-9402 revision from Pacific Swift. Created case SC-2026-001 and dispatched automated inquiry.',
          evidenceRefs: ['EV-001'],
          missingInfo: 'None'
        },
        {
          id: 'TASK-102',
          agent: 'Disruption Investigator',
          title: 'Carrier EDI & Satellite Telemetry Reconciliation',
          status: 'Completed',
          startTime: '2026-10-15T07:25:00Z',
          endTime: '2026-10-15T07:45:00Z',
          finding: 'Vessel discharge confirmed delayed. Verbal supplier promise of 24h recovery contradicted by port rail queue backlog.',
          evidenceRefs: ['EV-001', 'EV-003', 'EV-004'],
          missingInfo: 'Intermodal terminal gate pass number'
        },
        {
          id: 'TASK-103',
          agent: 'Impact Assessor',
          title: 'Stock Depletion & Stockout Probability Modeling',
          status: 'Completed',
          startTime: '2026-10-15T07:48:00Z',
          endTime: '2026-10-15T08:05:00Z',
          finding: 'Depot B runs dry in 25 hours (Oct 16 12:00 UTC). Estimated shortage is 3,400 units over 4 days. DC A has sufficient buffer.',
          evidenceRefs: ['EV-002'],
          missingInfo: 'Real-time morning pick reconciliations from Depot B'
        },
        {
          id: 'TASK-104',
          agent: 'Recovery Planner',
          title: 'Multi-Criteria Recovery Option Synthesis',
          status: 'Completed',
          startTime: '2026-10-15T08:10:00Z',
          endTime: '2026-10-15T08:35:00Z',
          finding: 'Synthesized 4 candidate plans: Inter-warehouse transfer, expedited air charter, store balancing, and baseline monitoring.',
          evidenceRefs: ['EV-001', 'EV-002'],
          missingInfo: 'Contracted rates for emergency third-party refrigerated trucks'
        },
        {
          id: 'TASK-105',
          agent: 'Decision Reviewer',
          title: 'Policy Compliance & Trade-off Verification',
          status: 'Completed',
          startTime: '2026-10-15T08:40:00Z',
          endTime: '2026-10-15T09:00:00Z',
          finding: 'Verified that a 3,500-unit transfer from DC A keeps DC A at 5.25 days coverage, satisfying the 4.0-day safety stock rule. Recommended Option 1.',
          evidenceRefs: ['EV-001', 'EV-002'],
          missingInfo: 'None. Ready for human operations manager authorization.'
        }
      ],
      recoveryOptions: [
        {
          id: 'OPT-01',
          name: 'Inter-Warehouse Transfer from Central DC',
          type: 'Inventory Transfer',
          leadTimeHours: 18,
          leadTimeDisplay: '18 hours',
          estimatedCost: 1450,
          shortageReductionPct: 92,
          unitsRecovered: 3500,
          feasibility: 'Feasible',
          capacityConstraints: 'Dedicated 53ft curtain-side truck booked via Apex Logistics; Central DC maintains 5.25 days safety coverage.',
          risksAndAssumptions: 'Assumes driver departure by 16:00 today; highway corridor Interstate 80 remains clear of weather delays.',
          supportingEvidence: ['EV-001', 'EV-002'],
          isRecommended: true
        },
        {
          id: 'OPT-02',
          name: 'Expedited Air Freight via Backup Supplier',
          type: 'Expedited Shipment',
          leadTimeHours: 24,
          leadTimeDisplay: '24 hours',
          estimatedCost: 6800,
          shortageReductionPct: 100,
          unitsRecovered: 3800,
          feasibility: 'Feasible',
          capacityConstraints: 'Requires secondary procurement authorization; vendor Apex Dist has palletized stock ready in Memphis.',
          risksAndAssumptions: 'Cost exceeds standard contingency allowance by 370%; requires VP Supply Chain sign-off.',
          supportingEvidence: ['EV-001'],
          isRecommended: false
        },
        {
          id: 'OPT-03',
          name: 'Emergency Store-to-Store Cluster Balancing',
          type: 'Local Redistribution',
          leadTimeHours: 36,
          leadTimeDisplay: '36 hours',
          estimatedCost: 2900,
          shortageReductionPct: 65,
          unitsRecovered: 2200,
          feasibility: 'Needs Verification',
          capacityConstraints: 'Requires pulling 250 units from each of 9 suburban retail stores; creates local labor overtime demands.',
          risksAndAssumptions: 'Store storekeepers have not confirmed pallet wrapping capabilities; risk of stockout spilling into retail stores.',
          supportingEvidence: ['EV-002'],
          isRecommended: false
        },
        {
          id: 'OPT-04',
          name: 'Wait and Monitor Baseline Inbound',
          type: 'Passive Monitoring',
          leadTimeHours: 96,
          leadTimeDisplay: '4 days (96h)',
          estimatedCost: 0,
          shortageReductionPct: 0,
          unitsRecovered: 0,
          feasibility: 'Not Feasible',
          capacityConstraints: 'No additional physical resources required.',
          risksAndAssumptions: 'Guarantees 3 full days of empty retail shelves at Depot B stores; estimated lost sales and contractual vendor fines total $20,366.',
          supportingEvidence: ['EV-001'],
          isRecommended: false
        }
      ],
      recommendation: {
        recommendedOptionId: 'OPT-01',
        title: 'Execute Inter-Warehouse Transfer of 3,500 Units from DC A to Depot B',
        rationale: 'Inter-warehouse transfer eliminates 92% of the projected stockout before Depot B runs out of stock in 25 hours. Moving 3,500 units leaves Central DC with 10,500 units (5.25 days of coverage), which strictly satisfies corporate safety-stock policy SEC-INV-2025 (minimum 4 days). Total cost of $1,450 saves $5,350 compared to air charter.',
        tradeoffs: 'Consumes $1,450 dedicated transport budget and lowers Central DC buffer from 7.0 days to 5.25 days.',
        uncertainty: 'Relies on carrier dispatch departing Central DC prior to 16:30 local time today to guarantee morning arrival.',
        evidenceRefs: ['EV-001', 'EV-002']
      },
      approval: {
        status: 'Pending Review', // Pending Review, Approved, Rejected, More Investigation Requested
        decision: null,
        approverName: null,
        timestamp: null,
        notes: null
      },
      outcome: {
        executionStatus: 'Not Started', // Not Started, In Progress, Completed, Blocked, Cancelled
        resolutionState: 'Unresolved',
        actualCost: null,
        actualUnitsRecovered: null,
        actualStockoutHours: null,
        updatedAt: null,
        notes: 'Awaiting human operations manager authorization.'
      }
    },
    {
      id: 'SC-2026-002',
      title: 'Cold Chain Compressor Failure - Chilled Dairy Hub',
      disruptionType: 'Warehouse Shutdown',
      risk: 'Critical',
      status: 'Awaiting Approval',
      triggerSource: 'Reported',
      createdAt: '2026-10-15T04:15:00Z',
      updatedAt: '2026-10-15T09:50:00Z',
      supplier: {
        id: 'SUP-204',
        name: 'Cascade Creamery Co',
        country: 'United States',
        tier: 'Tier 1 Strategic',
        reliabilityScore: '98.0%'
      },
      shipment: {
        id: 'SHP-9102',
        carrier: 'Arctic Cold Express',
        poNumber: 'PO-9511',
        origin: 'Yakima Processing Center',
        destination: 'Pacific Northwest Hub (WH-PAC-04)',
        originalEta: '2026-10-15T06:00:00Z',
        revisedEta: '2026-10-15T18:00:00Z',
        delayDays: 0.5,
        shippedQuantity: 12000,
        unit: 'cartons (2 L)'
      },
      product: {
        sku: 'MILK-ORG-2L',
        name: 'Organic Whole Milk 2L',
        category: 'Chilled Dairy',
        unitCost: 2.10,
        retailPrice: 4.89,
        shelfLifeDays: 14
      },
      summary: {
        headline: 'Reefer compressor failure at WH-PAC-04 threatens spoilage of 12,000 chilled units.',
        whatHappened: 'Stationary cooler compressor unit #2 suffered mechanical lockup at 03:45. Temperature rose to 6.2°C. Backup generators active, but secondary reefer trailer capacity required immediately to avert total product disposal.',
        knownFacts: [
          'Hub temperature exceeded 4.0°C regulatory safety limit for 45 minutes.',
          'Quality control flagged 12,000 cartons on quarantine hold.',
          'Mobile generator rental confirmed available within 2 hours.'
        ],
        unverifiedClaims: [
          'Technician estimate that internal product core temperature remained below 3.5°C needs digital thermocouple verification.'
        ],
        urgency: 'Extreme. Regulatory spoilage window closes in 3 hours.'
      },
      impactAssessment: {
        productSku: 'MILK-ORG-2L',
        totalUnitsDelayed: 12000,
        estimatedTotalShortage: 12000,
        financialRiskExposure: 58680.00,
        lastVerifiedTimestamp: '2026-10-15T09:00:00Z',
        locations: [
          {
            id: 'LOC-PAC-04',
            name: 'Pacific Northwest Hub (WH-PAC-04)',
            role: 'Regional Cold Storage',
            onHand: 12000,
            safetyStock: 5000,
            dailyDemand: 3000,
            daysCoverage: 4.0,
            coverageStatus: 'Quarantine / Spoilage Hazard',
            stockoutProjectedDate: '2026-10-16',
            transferAvailableUnits: 0
          }
        ],
        calculationAssumptions: [
          'Calculated assuming 100% loss if temperature does not stabilize under 3.5°C within 180 minutes.'
        ]
      },
      evidence: [
        {
          id: 'EV-101',
          source: 'IoT Facility Telemetry Hub',
          type: 'Sensor Stream',
          timestamp: '2026-10-15T04:00:00Z',
          verificationState: 'Verified',
          summary: 'Temp probe A3 recorded spike to 6.2°C at 03:52 UTC.',
          confidence: 'High',
          documentRef: 'TELEMETRY_PAC04_A3.json'
        }
      ],
      agentTasks: [
        {
          id: 'TASK-201',
          agent: 'Disruption Investigator',
          title: 'Thermal Sensor Quarantine Audit',
          status: 'Completed',
          startTime: '2026-10-15T04:20:00Z',
          endTime: '2026-10-15T04:50:00Z',
          finding: 'Core temp sampling indicated 3.8°C; product still salvagable if transferred to mobile reefers.',
          evidenceRefs: ['EV-101'],
          missingInfo: 'FDA inspector certification'
        }
      ],
      recoveryOptions: [
        {
          id: 'OPT-201',
          name: 'Deploy 3 Mobile Reefer Trailers on Site',
          type: 'Emergency Containment',
          leadTimeHours: 2.5,
          leadTimeDisplay: '2.5 hours',
          estimatedCost: 3200,
          shortageReductionPct: 100,
          unitsRecovered: 12000,
          feasibility: 'Feasible',
          capacityConstraints: 'Rental trailers staged at nearby carrier yard.',
          risksAndAssumptions: 'Requires 4 forklifts running dual shifts to cross-dock before 12:00.',
          supportingEvidence: ['EV-101'],
          isRecommended: true
        }
      ],
      recommendation: {
        recommendedOptionId: 'OPT-201',
        title: 'Mobilize 3 Reefer Trailers to WH-PAC-04',
        rationale: 'Averts $58,680 product write-off for $3,200 trailer rental cost.',
        tradeoffs: '$3,200 emergency operations expenditure.',
        uncertainty: 'Forklift driver availability on short notice.',
        evidenceRefs: ['EV-101']
      },
      approval: {
        status: 'Awaiting Approval',
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
        notes: 'Pending sign-off from QA director.'
      }
    },
    {
      id: 'SC-2026-003',
      title: 'Rail Freight Corridor Strike Threat',
      disruptionType: 'Transport Disruption',
      risk: 'Medium',
      status: 'In Progress',
      triggerSource: 'Proactive',
      createdAt: '2026-10-14T11:00:00Z',
      updatedAt: '2026-10-15T08:00:00Z',
      supplier: {
        id: 'SUP-305',
        name: 'Midwest Milling Co',
        country: 'United States',
        tier: 'Tier 2 Strategic',
        reliabilityScore: '89.5%'
      },
      shipment: {
        id: 'SHP-7744',
        carrier: 'Great Plains Rail Line',
        poNumber: 'PO-9110',
        origin: 'Minneapolis Mills',
        destination: 'Eastern DC (WH-EST-01)',
        originalEta: '2026-10-18T10:00:00Z',
        revisedEta: '2026-10-22T10:00:00Z',
        delayDays: 4,
        shippedQuantity: 15000,
        unit: 'bags (5 kg)'
      },
      product: {
        sku: 'FLOUR-ALL-5KG',
        name: 'All-Purpose Baking Flour 5kg',
        category: 'Baking & Grains',
        unitCost: 4.20,
        retailPrice: 7.49,
        shelfLifeDays: 540
      },
      summary: {
        headline: 'Rail strike cooling-off period expiration threatens Great Plains corridor transit.',
        whatHappened: 'Labor negotiations stalled for Northern corridor rail carrier. In-transit shipment of 15,000 bags flour expected to be halted at yard junction.',
        knownFacts: [
          'Great Plains Rail notified shippers of potential line embargo effective Oct 17.',
          'Eastern DC holds 8.5 days of current inventory.'
        ],
        unverifiedClaims: [
          'Federal mediation intervention potential remains unconfirmed.'
        ],
        urgency: 'Medium. DC has 8.5 days coverage; buffer permits 72h observation.'
      },
      impactAssessment: {
        productSku: 'FLOUR-ALL-5KG',
        totalUnitsDelayed: 15000,
        estimatedTotalShortage: 4000,
        financialRiskExposure: 29960.00,
        lastVerifiedTimestamp: '2026-10-14T18:00:00Z',
        locations: [
          {
            id: 'LOC-EST-01',
            name: 'Eastern Distribution Center',
            role: 'Primary Hub',
            onHand: 18000,
            safetyStock: 10000,
            dailyDemand: 2100,
            daysCoverage: 8.5,
            coverageStatus: 'Adequate Buffer',
            stockoutProjectedDate: '2026-10-24',
            transferAvailableUnits: 6000
          }
        ],
        calculationAssumptions: ['Assumes regular seasonal baking demand.']
      },
      evidence: [
        {
          id: 'EV-201',
          source: 'Federal Railroad Administration Advisory',
          type: 'Government Advisory',
          timestamp: '2026-10-14T09:30:00Z',
          verificationState: 'Verified',
          summary: 'Cooling off period expires Oct 17 at 00:01 EST.',
          confidence: 'High',
          documentRef: 'FRA_NOTICE_2026_10.pdf'
        }
      ],
      agentTasks: [
        {
          id: 'TASK-301',
          agent: 'Impact Assessor',
          title: 'Stock Runway Buffer Evaluation',
          status: 'Completed',
          startTime: '2026-10-14T12:00:00Z',
          endTime: '2026-10-14T12:45:00Z',
          finding: 'Eastern DC stock will not drop below safety stock until Oct 21.',
          evidenceRefs: ['EV-201'],
          missingInfo: 'None'
        }
      ],
      recoveryOptions: [
        {
          id: 'OPT-301',
          name: 'Pre-emptive Highway Trucking Reroute',
          type: 'Mode Shift',
          leadTimeHours: 48,
          leadTimeDisplay: '48 hours',
          estimatedCost: 4500,
          shortageReductionPct: 100,
          unitsRecovered: 15000,
          feasibility: 'Feasible',
          capacityConstraints: 'Requires securing 6 long-haul dry vans.',
          risksAndAssumptions: 'Highway spot freight rate premium is 45% above rail contract.',
          supportingEvidence: ['EV-201'],
          isRecommended: false
        },
        {
          id: 'OPT-302',
          name: 'Stage-Gate Monitoring with Trucking Contingency Option',
          type: 'Contingency Hold',
          leadTimeHours: 72,
          leadTimeDisplay: '72 hours',
          estimatedCost: 500,
          shortageReductionPct: 90,
          unitsRecovered: 15000,
          feasibility: 'Feasible',
          capacityConstraints: 'Pay $500 reservation fee to hold 6 trucks on standby until Oct 16 17:00.',
          risksAndAssumptions: 'Allows 48h for labor deal without risking inventory stockout.',
          supportingEvidence: ['EV-201'],
          isRecommended: true
        }
      ],
      recommendation: {
        recommendedOptionId: 'OPT-302',
        title: 'Reserve 6 Standby Trucks on 48-Hour Hold',
        rationale: 'Avoids spending $4,500 prematurely while preserving complete stockout protection if rail stops.',
        tradeoffs: '$500 unrefundable carrier standby retainer.',
        uncertainty: 'Rail strike probability estimated between 40-60%.',
        evidenceRefs: ['EV-201']
      },
      approval: {
        status: 'Approved',
        decision: 'Approved',
        approverName: 'Marcus Vance (Logistics VP)',
        timestamp: '2026-10-14T16:00:00Z',
        notes: 'Approved $500 reservation hold. Re-evaluate tomorrow 12:00.'
      },
      outcome: {
        executionStatus: 'In Progress',
        resolutionState: 'Under Observation',
        actualCost: 500,
        actualUnitsRecovered: null,
        actualStockoutHours: 0,
        updatedAt: '2026-10-15T08:00:00Z',
        notes: 'Trucks held on standby. Carrier talks ongoing in Chicago.'
      }
    },
    {
      id: 'SC-2026-004',
      title: 'Regional Promotional Surge - Fresh Citrus Juice',
      disruptionType: 'Demand Spike',
      risk: 'Medium',
      status: 'Planning',
      triggerSource: 'Reported',
      createdAt: '2026-10-15T08:00:00Z',
      updatedAt: '2026-10-15T10:15:00Z',
      supplier: {
        id: 'SUP-408',
        name: 'SunHarvest Citrus',
        country: 'United States',
        tier: 'Tier 1 Strategic',
        reliabilityScore: '96.2%'
      },
      shipment: {
        id: 'SHP-6612',
        carrier: 'SunState Express',
        poNumber: 'PO-9820',
        origin: 'Orlando Processing Plant',
        destination: 'Southeast Fulfillment Hub',
        originalEta: '2026-10-17T12:00:00Z',
        revisedEta: '2026-10-17T12:00:00Z',
        delayDays: 0,
        shippedQuantity: 6000,
        unit: 'bottles (1 L)'
      },
      product: {
        sku: 'JUICE-ORNG-1L',
        name: 'Fresh Squeezed Orange Juice 1L',
        category: 'Refrigerated Beverages',
        unitCost: 1.80,
        retailPrice: 3.99,
        shelfLifeDays: 28
      },
      summary: {
        headline: 'Unscheduled viral social promotion drove 240% sales acceleration in Southeast region.',
        whatHappened: 'A regional influencer marketing campaign caused unexpected demand surge. Standard 800 bottles/day run rate spiked to 2,100 bottles/day.',
        knownFacts: [
          'POS store registers logged 2,140 bottles sold yesterday versus 820 typical.',
          'Southeast Hub stock dropped to 1.8 days coverage.'
        ],
        unverifiedClaims: [
          'Marketing department claims surge will persist for 10 straight days without tapering.'
        ],
        urgency: 'Medium. Need supplemental replenishment order placed within 24h.'
      },
      impactAssessment: {
        productSku: 'JUICE-ORNG-1L',
        totalUnitsDelayed: 0,
        estimatedTotalShortage: 4500,
        financialRiskExposure: 17955.00,
        lastVerifiedTimestamp: '2026-10-15T09:45:00Z',
        locations: [
          {
            id: 'LOC-SE-02',
            name: 'Southeast Fulfillment Hub',
            role: 'Regional Hub',
            onHand: 3800,
            safetyStock: 3000,
            dailyDemand: 2100,
            daysCoverage: 1.8,
            coverageStatus: 'Rapid Depletion',
            stockoutProjectedDate: '2026-10-17',
            transferAvailableUnits: 0
          }
        ],
        calculationAssumptions: ['Assumes elevated demand decays to 1,400 units/day over 5 days.']
      },
      evidence: [
        {
          id: 'EV-301',
          source: 'Retail Store POS Data Stream',
          type: 'Transaction Telemetry',
          timestamp: '2026-10-15T07:45:00Z',
          verificationState: 'Verified',
          summary: 'Aggregate register receipts show 161% jump in checkout scans.',
          confidence: 'High',
          documentRef: 'POS_SE_STORES_OCT14.json'
        }
      ],
      agentTasks: [
        {
          id: 'TASK-401',
          agent: 'Impact Assessor',
          title: 'Promotional Demand Decay Curve Modeling',
          status: 'Running',
          startTime: '2026-10-15T09:00:00Z',
          endTime: null,
          finding: 'Running demand decay regression to estimate net 7-day shortage.',
          evidenceRefs: ['EV-301'],
          missingInfo: 'Marketing ad spend schedule'
        }
      ],
      recoveryOptions: [
        {
          id: 'OPT-401',
          name: 'Accelerate Scheduled PO-9820 Production Batch',
          type: 'Supplier Acceleration',
          leadTimeHours: 36,
          leadTimeDisplay: '36 hours',
          estimatedCost: 1200,
          shortageReductionPct: 85,
          unitsRecovered: 5000,
          feasibility: 'Feasible',
          capacityConstraints: 'SunHarvest has open weekend bottling slot in Orlando.',
          risksAndAssumptions: 'Incurs overtime bottling surcharge.',
          supportingEvidence: ['EV-301'],
          isRecommended: true
        }
      ],
      recommendation: {
        recommendedOptionId: 'OPT-401',
        title: 'Authorize $1,200 Overtime Run with SunHarvest',
        rationale: 'Supplies 5,000 fresh units in time for weekend retail volume peak.',
        tradeoffs: '$1,200 expedite charge.',
        uncertainty: 'Customer demand persistence beyond Saturday.',
        evidenceRefs: ['EV-301']
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
        notes: 'Planner evaluating final order quantity.'
      }
    }
  ],

  // Append-only Audit Log
  auditEvents: [
    {
      id: 'AUD-901',
      timestamp: '2026-10-15T10:45:00Z',
      caseId: 'SC-2026-001',
      eventType: 'Assessment Refreshed',
      actorType: 'Agent',
      actorName: 'Impact Assessor',
      summary: 'Re-evaluated Depot B stock coverage after morning 09:30 POS scan; confirmed 1.04 days coverage remains.',
      diff: 'Coverage updated: 1.08d -> 1.04d.'
    },
    {
      id: 'AUD-902',
      timestamp: '2026-10-15T09:00:00Z',
      caseId: 'SC-2026-001',
      eventType: 'Option Proposed',
      actorType: 'Agent',
      actorName: 'Decision Reviewer',
      summary: 'Verified Option 1 (Inter-warehouse transfer) meets corporate safety stock rules; recommended for approval.',
      diff: 'Recommendation assigned: OPT-01.'
    },
    {
      id: 'AUD-903',
      timestamp: '2026-10-15T08:35:00Z',
      caseId: 'SC-2026-001',
      eventType: 'Recovery Options Formulated',
      actorType: 'Agent',
      actorName: 'Recovery Planner',
      summary: 'Generated 4 candidate recovery strategies with cost, lead time, and shortage trade-offs.',
      diff: 'Generated 4 options.'
    },
    {
      id: 'AUD-904',
      timestamp: '2026-10-15T07:45:00Z',
      caseId: 'SC-2026-001',
      eventType: 'Evidence Appended',
      actorType: 'Agent',
      actorName: 'Disruption Investigator',
      summary: 'Retrieved AIS satellite position and reconciled against EDI 214 delay notice.',
      diff: 'Appended EV-004 (Conflicting).'
    },
    {
      id: 'AUD-905',
      timestamp: '2026-10-15T07:20:00Z',
      caseId: 'SC-2026-001',
      eventType: 'Case Initialized',
      actorType: 'System',
      actorName: 'Proactive Signal Monitor',
      summary: 'EDI 214 latency alert triggered rule RULE-02; case SC-2026-001 initialized.',
      diff: 'Status: Investigating, Risk: High.'
    },
    {
      id: 'AUD-898',
      timestamp: '2026-10-14T16:00:00Z',
      caseId: 'SC-2026-003',
      eventType: 'Approval Recorded',
      actorType: 'Human',
      actorName: 'Marcus Vance',
      summary: 'Approved $500 reservation retainer for standby trucks.',
      diff: 'Approval: Approved, Status: In Progress.'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.INITIAL_MOCK_DATA = INITIAL_MOCK_DATA;
}
if (typeof global !== 'undefined') {
  global.INITIAL_MOCK_DATA = INITIAL_MOCK_DATA;
}

