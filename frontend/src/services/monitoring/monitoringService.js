/**
 * SupplyGuard Monitoring Service Layer
 */
import { apiClient, isLiveBackendConfigured } from '../api/client.js';
import { loadMockState, saveMockState } from '../../data/mock/storage.js';

const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMonitoringData() {
  if (isLiveBackendConfigured) {
    const live = await apiClient('/monitoring');
    if (live) return live;
  }

  await delay(40);
  const state = loadMockState();
  return JSON.parse(JSON.stringify(state.monitoring));
}

export async function simulateSignalIngestion() {
  if (isLiveBackendConfigured) {
    const live = await apiClient('/monitoring/simulate', { method: 'POST' });
    if (live) return live;
  }

  await delay(80);
  const state = loadMockState();
  const now = new Date().toISOString();
  const newSignal = {
    id: `SIG-${Math.floor(8900 + Math.random() * 1000)}`,
    timestamp: now,
    ruleId: 'RULE-01',
    ruleName: 'Projected Stock Depletion Alert',
    entity: 'Midwest Regional Hub (WH-MW-02)',
    description: 'Cereal grains inventory runway dipped to 3.2 days (safety threshold is 4.0 days).',
    severity: 'Medium',
    linkedCaseId: null,
  };

  state.monitoring.detectedEvents.unshift(newSignal);
  state.monitoring.lastEvaluation = now;
  state.monitoring.signalsEvaluatedToday += 14;

  state.auditEvents.unshift({
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: now,
    caseId: 'SYSTEM',
    eventType: 'Signal Ingested',
    actorType: 'System',
    actorName: 'Automated Telemetry Listener',
    summary: `Ingested proactive alert ${newSignal.id}: ${newSignal.entity} runway breach.`,
    diff: `Generated signal ${newSignal.id}.`,
  });

  saveMockState(state);
  return newSignal;
}
