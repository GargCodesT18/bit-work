/**
 * SupplyGuard Mock LocalStorage Persistence Adapter
 */
import { INITIAL_MOCK_DATA } from './initialState.js';

const STORAGE_KEY = 'supplyguard_react_state_v1';

export function loadMockState() {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Failed to load SupplyGuard state from localStorage:', err);
  }

  return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
}

export function saveMockState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save SupplyGuard state to localStorage:', err);
  }
}

export function resetMockState() {
  const clean = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  saveMockState(clean);
  return clean;
}
