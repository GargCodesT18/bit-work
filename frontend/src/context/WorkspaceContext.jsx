/**
 * SupplyGuard Global Workspace Context
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDashboardSummary, resetDemoData } from '../services/cases/caseService.js';
import { useToast } from './ToastContext.jsx';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const loadSummary = useCallback(async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const refreshWorkspace = useCallback(async () => {
    setRefreshing(true);
    await loadSummary();
    showToast('Workspace telemetry refreshed.', 'success');
  }, [loadSummary, showToast]);

  const handleResetDemoData = useCallback(async () => {
    try {
      await resetDemoData();
      await loadSummary();
      showToast('Demo data restored to initial canonical baseline.', 'info');
    } catch (err) {
      showToast(`Reset failed: ${err.message}`, 'error');
    }
  }, [loadSummary, showToast]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        summary,
        loading,
        refreshing,
        sidebarCollapsed,
        searchQuery,
        setSearchQuery,
        toggleSidebar,
        refreshWorkspace,
        resetDemoData: handleResetDemoData,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
}
