import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, RefreshCw, Search } from 'lucide-react';
import {
  getCaseById,
  refreshAssessment,
  requestInvestigation,
  addEvidence,
  submitApproval,
  updateOutcome,
} from '../../services/cases/caseService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { RiskBadge } from '../../components/common/RiskBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { TriggerBadge } from '../../components/common/TriggerBadge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { formatDateTime, formatTimeAgo } from '../../utils/formatters.js';

import { SummaryTab } from './tabs/SummaryTab.jsx';
import { ImpactTab } from './tabs/ImpactTab.jsx';
import { EvidenceTab } from './tabs/EvidenceTab.jsx';
import { AgentsTab } from './tabs/AgentsTab.jsx';
import { RecoveryTab } from './tabs/RecoveryTab.jsx';
import { ApprovalTab } from './tabs/ApprovalTab.jsx';
import { OutcomeTab } from './tabs/OutcomeTab.jsx';

export function CaseWorkspacePage() {
  const { caseId = 'SC-2026-001' } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentCase, setCurrentCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);
  const [investigationQuery, setInvestigationQuery] = useState('');
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceSource, setEvidenceSource] = useState('Carrier EDI 214 Revision');
  const [evidenceSummary, setEvidenceSummary] = useState('');

  const [approverName, setApproverName] = useState('Alex Morgan (Ops Lead)');
  const [approvalNotes, setApprovalNotes] = useState('Approved inter-warehouse stock transfer.');

  const approvalStampRef = useRef(null);

  useEffect(() => {
    async function loadCase() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCaseById(caseId);
        setCurrentCase(data);
        setSelectedOptionId(data.recommendation?.recommendedOptionId || data.recoveryOptions[0]?.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCase();
  }, [caseId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const updated = await refreshAssessment(caseId);
      setCurrentCase(updated);
      showToast('Re-evaluated stock depletion runway against real-time POS velocity.', 'success');
    } catch (err) {
      showToast(`Refresh failed: ${err.message}`, 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRequestInvestigation = async (e) => {
    e.preventDefault();
    if (!investigationQuery.trim()) return;
    try {
      const updated = await requestInvestigation(caseId, investigationQuery.trim());
      setCurrentCase(updated);
      setIsInvestigationModalOpen(false);
      setInvestigationQuery('');
      setActiveTab('agents');
      showToast('Specialist agent dispatched with supplemental inquiry.', 'info');
    } catch (err) {
      showToast(`Request failed: ${err.message}`, 'error');
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceSummary.trim()) return;
    try {
      await addEvidence(caseId, {
        source: evidenceSource,
        type: 'Operator Documentary Evidence',
        verificationState: 'Unverified',
        summary: evidenceSummary.trim(),
        confidence: 'Medium',
      });
      const reloaded = await getCaseById(caseId);
      setCurrentCase(reloaded);
      setIsEvidenceModalOpen(false);
      setEvidenceSummary('');
      showToast('Attached new evidence item with verification state: Unverified.', 'success');
    } catch (err) {
      showToast(`Evidence failed: ${err.message}`, 'error');
    }
  };

  const handleApprovalDecision = async (decision) => {
    try {
      const updated = await submitApproval(caseId, {
        decision,
        approverName,
        notes: approvalNotes,
      });
      setCurrentCase(updated);

      if (decision === 'approve') {
        showToast(`Recommendation authorized by ${approverName}.`, 'success');
        if (approvalStampRef.current) {
          gsap.fromTo(
            approvalStampRef.current,
            { scale: 0.96, opacity: 0.5 },
            { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
          );
        }
        setActiveTab('outcome');
      } else if (decision === 'reject') {
        showToast(`Recommendation rejected by ${approverName}.`, 'warning');
      } else {
        showToast(`Additional investigation requested by ${approverName}.`, 'info');
      }
    } catch (err) {
      showToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleUpdateOutcomeStatus = async (status, notes, actualCost = null, actualUnits = null) => {
    try {
      const updated = await updateOutcome(caseId, {
        executionStatus: status,
        notes,
        actualCost,
        actualUnitsRecovered: actualUnits,
        resolutionState: status === 'Completed' ? 'Resolved' : 'In Progress',
      });
      setCurrentCase(updated);
      showToast(`Outcome execution updated to ${status}.`, 'success');
    } catch (err) {
      showToast(`Outcome update failed: ${err.message}`, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message={`Loading disruption workspace for ${caseId}...`} />;
  }

  if (error || !currentCase) {
    return (
      <ErrorState
        title="Case Not Found"
        message={error || `Case ${caseId} could not be retrieved.`}
        onRetry={() => navigate('/disruptions')}
      />
    );
  }

  const isApproved = currentCase.approval?.status === 'Approved';

  const tabList = [
    { id: 'summary', label: 'A. Incident Summary' },
    { id: 'impact', label: 'B. Impact Assessment' },
    { id: 'evidence', label: `C. Evidence Ledger (${currentCase.evidence?.length || 0})` },
    { id: 'agents', label: `D. Agent Task Trace (${currentCase.agentTasks?.length || 0})` },
    { id: 'recovery', label: `E. Recovery Options (${currentCase.recoveryOptions?.length || 0})` },
    {
      id: 'approval',
      label: isApproved ? 'F. Recommendation [Approved]' : 'F. Recommendation & Approval',
    },
    { id: 'outcome', label: 'G. Outcome Tracking' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="sg-card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="code-tag font-bold" style={{ fontSize: '13px' }}>{currentCase.id}</span>
            <RiskBadge risk={currentCase.risk} />
            <StatusBadge status={currentCase.status} />
            <TriggerBadge source={currentCase.triggerSource} />
            <span className="badge badge-demo">Demo Mode</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-secondary btn-sm"
              title="Re-evaluate deterministic stock runway calculations"
            >
              <RefreshCw size={13} className={refreshing ? 'spinner' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Assessment'}</span>
            </button>
            <button
              onClick={() => setIsInvestigationModalOpen(true)}
              className="btn btn-secondary btn-sm"
              title="Instruct multi-agent specialists to collect more facts"
            >
              <Search size={13} />
              <span>Request More Investigation</span>
            </button>
            <button
              onClick={() => navigate('/disruptions')}
              className="btn btn-subtle btn-sm"
            >
              <ArrowLeft size={13} />
              <span>Back to Cases</span>
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-bistre)', marginBottom: '8px' }}>
          {currentCase.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          <div><strong>Disruption Type:</strong> {currentCase.disruptionType}</div>
          <div><strong>Primary Supplier:</strong> {currentCase.supplier?.name} ({currentCase.supplier?.tier})</div>
          <div><strong>Created:</strong> {formatDateTime(currentCase.createdAt)}</div>
          <div><strong>Last Evaluated:</strong> {formatTimeAgo(currentCase.updatedAt)}</div>
        </div>
      </div>

      <nav
        role="tablist"
        aria-label="Investigation Workspace Sections"
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--color-quill)',
          overflowX: 'auto',
          backgroundColor: 'var(--color-bone)',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          padding: '6px 12px 0 12px',
        }}
      >
        {tabList.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
                color: isActive ? 'var(--color-bistre)' : 'var(--color-graphite)',
                borderBottom: isActive ? '2px solid var(--color-bistre)' : '2px solid transparent',
                borderRadius: '4px 4px 0 0',
                backgroundColor: isActive ? 'rgba(226, 230, 125, 0.2)' : 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div style={{ minHeight: '400px' }}>
        {activeTab === 'summary' && <SummaryTab caseData={currentCase} />}

        {activeTab === 'impact' && <ImpactTab caseData={currentCase} />}

        {activeTab === 'evidence' && (
          <EvidenceTab
            caseData={currentCase}
            onOpenAddEvidence={() => setIsEvidenceModalOpen(true)}
          />
        )}

        {activeTab === 'agents' && <AgentsTab caseData={currentCase} />}

        {activeTab === 'recovery' && (
          <RecoveryTab
            caseData={currentCase}
            selectedOptionId={selectedOptionId}
            onSelectOption={setSelectedOptionId}
          />
        )}

        {activeTab === 'approval' && (
          <ApprovalTab
            caseData={currentCase}
            approverName={approverName}
            setApproverName={setApproverName}
            approvalNotes={approvalNotes}
            setApprovalNotes={setApprovalNotes}
            onDecision={handleApprovalDecision}
            approvalStampRef={approvalStampRef}
          />
        )}

        {activeTab === 'outcome' && (
          <OutcomeTab
            caseData={currentCase}
            onUpdateOutcome={handleUpdateOutcomeStatus}
          />
        )}
      </div>

      <Modal
        isOpen={isInvestigationModalOpen}
        onClose={() => setIsInvestigationModalOpen(false)}
        title="Request Supplemental Investigation"
        subtitle="Instruct the Disruption Investigator and Impact Assessor to query secondary feeds"
      >
        <form onSubmit={handleRequestInvestigation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-bistre)', marginBottom: '4px' }}>
              Investigation Inquiry / Verification Parameter *
            </label>
            <textarea
              rows={3}
              value={investigationQuery}
              onChange={(e) => setInvestigationQuery(e.target.value)}
              placeholder="e.g. Verify intermodal container rail ramp transfer schedule..."
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setIsInvestigationModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Dispatch Inquiry
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Attach Supporting Evidence"
        subtitle="Append verifiable telemetry, bill of lading, or inspection documents"
      >
        <form onSubmit={handleAddEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-bistre)', marginBottom: '4px' }}>
              Evidence Source *
            </label>
            <input
              type="text"
              value={evidenceSource}
              onChange={(e) => setEvidenceSource(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-bistre)', marginBottom: '4px' }}>
              Summary & Findings *
            </label>
            <textarea
              rows={3}
              value={evidenceSummary}
              onChange={(e) => setEvidenceSummary(e.target.value)}
              placeholder="e.g. Carrier confirmed driver departure at 15:30 UTC..."
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setIsEvidenceModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Attach Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
