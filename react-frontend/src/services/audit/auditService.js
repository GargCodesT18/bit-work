/**
 * SupplyGuard Audit Trail Service Layer
 */
import { apiClient, isLiveBackendConfigured } from '../api/client.js';
import { loadMockState, saveMockState } from '../../data/mock/storage.js';

const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAuditEvents(filters = {}) {
  if (isLiveBackendConfigured) {
    const query = new URLSearchParams(filters).toString();
    const live = await apiClient(`/audit-events?${query}`);
    if (live) return live;
  }

  await delay(40);
  const state = loadMockState();
  let events = [...state.auditEvents];

  if (filters.caseId && filters.caseId !== 'All') {
    events = events.filter((e) => e.caseId === filters.caseId);
  }
  if (filters.actorType && filters.actorType !== 'All') {
    events = events.filter(
      (e) => e.actorType.toLowerCase() === filters.actorType.toLowerCase()
    );
  }
  if (filters.eventType && filters.eventType !== 'All') {
    events = events.filter((e) =>
      e.eventType.toLowerCase().includes(filters.eventType.toLowerCase())
    );
  }

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function addAuditEvent(event) {
  const state = loadMockState();
  const newEvent = {
    id: `AUD-${Math.floor(950 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    caseId: event.caseId || 'SYSTEM',
    eventType: event.eventType || 'System Event',
    actorType: event.actorType || 'System',
    actorName: event.actorName || 'Automated Monitor',
    summary: event.summary || 'Unspecified audit occurrence.',
    diff: event.diff || '',
  };
  state.auditEvents.unshift(newEvent);
  if (state.auditEvents.length > 100) {
    state.auditEvents.pop();
  }
  saveMockState(state);
  return newEvent;
}
