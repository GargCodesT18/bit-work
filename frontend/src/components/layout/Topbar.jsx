/**
 * SupplyGuard Topbar Header
 */
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Bell, Menu, Shield } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatTimeAgo } from '../../utils/formatters.js';

export function Topbar() {
  const { summary, refreshing, refreshWorkspace, searchQuery, setSearchQuery, toggleSidebar } = useWorkspace();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Global '/' keyboard shortcut to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine breadcrumb label from route
  const path = location.pathname;
  let breadcrumbLabel = 'Control Center';
  if (path.startsWith('/disruptions/')) {
    const caseId = path.split('/')[2];
    breadcrumbLabel = `Disruption Workspace / ${caseId}`;
  } else if (path.startsWith('/disruptions')) {
    breadcrumbLabel = 'Disruption Cases';
  } else if (path.startsWith('/monitoring')) {
    breadcrumbLabel = 'Risk Monitoring & Alert Intake';
  } else if (path.startsWith('/network')) {
    breadcrumbLabel = 'Supply Network & Hubs';
  } else if (path.startsWith('/recovery')) {
    breadcrumbLabel = 'Enterprise Recovery Plans';
  } else if (path.startsWith('/audit')) {
    breadcrumbLabel = 'Activity & Compliance Audit';
  } else if (path.startsWith('/settings')) {
    breadcrumbLabel = 'Settings & Simulation';
  }

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim();
      if (q) {
        navigate(`/disruptions?search=${encodeURIComponent(q)}`);
      }
    }
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'rgba(247, 246, 243, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px dashed rgba(26, 22, 20, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left: Breadcrumbs & Mobile trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleSidebar}
          className="btn-icon"
          aria-label="Toggle navigation"
          style={{ display: 'none' }} // Hidden by default, activated on small viewports
        >
          <Menu size={20} />
        </button>

        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-graphite, #66635f)' }}>
            SupplyGuard
          </span>
          <span style={{ color: 'var(--color-flint, #a8a7a1)' }}>/</span>
          <span style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '17px', fontWeight: 400, color: 'var(--color-bistre, #1a1614)' }}>
            {breadcrumbLabel}
          </span>
        </nav>
      </div>

      {/* Right: Search, Refresh, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Global Search */}
        <div
          style={{
            position: 'relative',
            width: '260px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search cases, SKUs... (/)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            aria-label="Search cases globally"
            style={{
              paddingLeft: '34px',
              width: '100%',
              height: '36px',
              fontSize: '13px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-bone, #fdfcfa)',
              border: '1px solid rgba(26, 22, 20, 0.12)',
            }}
          />
        </div>

        {/* Refresh Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={refreshWorkspace}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
            title="Refresh workspace telemetry from carrier feeds"
            style={{ height: '36px' }}
          >
            <RefreshCw size={14} className={refreshing ? 'spinner' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {summary?.lastRefreshed ? formatTimeAgo(summary.lastRefreshed) : 'Live'}
          </span>
        </div>

        {/* Notifications */}
        <button
          onClick={() =>
            showToast(
              'Active Alert: 4-day delivery lag on PO-9402 creates stockout hazard for Metro Regional Depot.',
              'warning'
            )
          }
          className="btn-icon"
          aria-label="System notifications"
          title="Active operational notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-critical)',
              border: '2px solid #FFFFFF',
            }}
          />
        </button>

        {/* User / Operator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderLeft: '1px solid var(--color-border)',
            paddingLeft: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-navy)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'var(--font-weight-bold)',
            }}
            aria-hidden="true"
          >
            AM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', lineHeight: 1.2 }}>
              Alex Morgan
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', lineHeight: 1 }}>
              Ops Lead • Level 3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
