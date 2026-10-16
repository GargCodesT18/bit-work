/**
 * SupplyGuard API Client Facade
 * 
 * Inspects VITE_API_BASE_URL:
 * - If defined and not empty, routes requests via fetch to the live backend.
 * - If undefined or empty, returns null to signal service functions to use the offline mock adapter.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const isLiveBackendConfigured = Boolean(BASE_URL && BASE_URL.trim() !== '');

export async function apiClient(endpoint, options = {}) {
  if (!isLiveBackendConfigured) {
    return null; // Signals caller to use mock adapter
  }

  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}
