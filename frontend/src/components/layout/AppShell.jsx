/**
 * SupplyGuard Operations Control Center Layout Shell
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function AppShell() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Collapsible Left Rail Navigation */}
      <Sidebar />

      {/* Main Content Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main
          id="main-content"
          style={{
            flex: 1,
            padding: '24px 32px',
            maxWidth: 'var(--max-content-width)',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
