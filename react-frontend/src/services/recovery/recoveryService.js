/**
 * SupplyGuard Recovery Plans Service Layer
 */
import { apiClient, isLiveBackendConfigured } from '../api/client.js';
import { loadMockState } from '../../data/mock/storage.js';

const delay = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRecoveryPlans() {
  if (isLiveBackendConfigured) {
    const live = await apiClient('/recovery-plans');
    if (live) return live;
  }

  await delay(50);
  const state = loadMockState();
  const plans = [];

  state.cases.forEach((c) => {
    if (c.recoveryOptions && c.recoveryOptions.length > 0) {
      c.recoveryOptions.forEach((opt) => {
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
          approvalState:
            c.recommendation?.recommendedOptionId === opt.id
              ? c.approval?.status || 'Pending Review'
              : 'Alternative',
          executionState:
            c.recommendation?.recommendedOptionId === opt.id
              ? c.outcome?.executionStatus || 'Not Started'
              : 'N/A',
          approverName: c.approval?.approverName || 'Unassigned',
          lastUpdate: c.updatedAt,
        });
      });
    }
  });

  return plans;
}
