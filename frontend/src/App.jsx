/**
 * SupplyGuard Application Router
 * Integrates Landing Page and Operations Control Center Shell
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { ControlCenterPage } from './pages/control-center/ControlCenterPage.jsx';
import { DisruptionsPage } from './pages/disruptions/DisruptionsPage.jsx';
import { CaseWorkspacePage } from './pages/case-workspace/CaseWorkspacePage.jsx';
import { MonitoringPage } from './pages/monitoring/MonitoringPage.jsx';
import { NetworkPage } from './pages/network/NetworkPage.jsx';
import { RecoveryPlansPage } from './pages/recovery/RecoveryPlansPage.jsx';
import { AuditTrailPage } from './pages/audit/AuditTrailPage.jsx';
import { SettingsPage } from './pages/settings/SettingsPage.jsx';

export function App() {
  return (
    <Routes>
      {/* Public Landing & Editorial Overview */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Authenticated / Operations Control Center Workspace */}
      <Route element={<AppShell />}>
        <Route path="/control-center" element={<ControlCenterPage />} />
        <Route path="/disruptions" element={<DisruptionsPage />} />
        <Route path="/disruptions/:caseId" element={<CaseWorkspacePage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/recovery" element={<RecoveryPlansPage />} />
        <Route path="/recovery-plans" element={<Navigate to="/recovery" replace />} />
        <Route path="/audit" element={<AuditTrailPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/control-center" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
