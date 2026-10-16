/**
 * SupplyGuard Operations Sidebar Navigation
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertOctagon,
  Activity,
  Network,
  ShieldCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Globe,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, summary } = useWorkspace();

  const navItems = [
    { to: '/control-center', label: 'Control Center', icon: LayoutDashboard },
    {
      to: '/disruptions',
      label: 'Disruptions',
      icon: AlertOctagon,
      badge: summary?.activeDisruptions || null,
    },
    { to: '/monitoring', label: 'Risk Monitoring', icon: Activity, badge: 'Live' },
    { to: '/network', label: 'Supply Network', icon: Network },
    { to: '/recovery', label: 'Recovery Plans', icon: ShieldCheck },
    { to: '/audit', label: 'Audit Trail', icon: FileText },
  ];

  return (
    <aside
      aria-label="Control Center Navigation"
      style={{
        width: sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--color-navy)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'width var(--transition-normal)',
        flexShrink: 0,
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          padding: sidebarCollapsed ? '0' : '0 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <NavLink
          to="/landing"
          title="Return to Product Landing Page"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-chartreuse-whisper, #e2e67d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-bistre, #1a1614)',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={18} />
          </div>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-test-signifier, serif)', fontSize: '17px', fontWeight: 400, letterSpacing: '-0.02em', color: '#f4f4e7' }}>
                SupplyGuard
              </span>
              <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '10px', color: '#a8a7a1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Control Center
              </span>
            </div>
          )}
        </NavLink>

        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            style={{
              color: '#94A3B8',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav
        style={{
          flex: 1,
          padding: '16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={sidebarCollapsed ? item.label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarCollapsed ? '10px 0' : '10px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: '4px',
                color: isActive ? '#f4f4e7' : '#a8a7a1',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? '3px solid var(--color-chartreuse-whisper, #e2e67d)' : '3px solid transparent',
              })}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!sidebarCollapsed && item.badge && (
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor:
                      typeof item.badge === 'number'
                        ? '#C84040'
                        : 'var(--color-chartreuse-whisper, #e2e67d)',
                    color: typeof item.badge === 'number' ? '#FFFFFF' : '#1a1614',
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '12px 4px' }} />

        <NavLink
          to="/landing"
          title={sidebarCollapsed ? 'Product Landing' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: sidebarCollapsed ? '10px 0' : '10px 12px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderRadius: 'var(--radius-md)',
            color: '#94A3B8',
            backgroundColor: 'transparent',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            textDecoration: 'none',
            borderLeft: '3px solid transparent',
          }}
        >
          <Globe size={18} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && <span>Product Overview</span>}
        </NavLink>

        <NavLink
          to="/settings"
          title={sidebarCollapsed ? 'Settings' : undefined}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: sidebarCollapsed ? '10px 0' : '10px 12px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderRadius: 'var(--radius-md)',
            color: isActive ? '#FFFFFF' : '#94A3B8',
            backgroundColor: isActive ? 'rgba(36, 87, 214, 0.25)' : 'transparent',
            fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            textDecoration: 'none',
            borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
          })}
        >
          <Settings size={18} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* Footer / Telemetry Status */}
      <div
        style={{
          padding: sidebarCollapsed ? '12px 0' : '14px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          backgroundColor: 'rgba(10, 19, 36, 0.4)',
        }}
      >
        {sidebarCollapsed ? (
          <button
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            style={{ color: '#94A3B8', padding: '4px' }}
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Telemetry Active</span>
            </div>
            <span className="badge badge-demo">Demo</span>
          </>
        )}
      </div>
    </aside>
  );
}
