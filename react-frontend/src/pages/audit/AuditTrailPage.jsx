/**
 * SupplyGuard Activity & Compliance Audit Trail
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, RotateCcw } from 'lucide-react';
import { getAuditEvents } from '../../services/audit/auditService.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { formatTimeAgo, formatDateTime } from '../../utils/formatters.js';

export function AuditTrailPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actorFilter, setActorFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const res = await getAuditEvents({
          actorType: actorFilter,
          eventType: eventFilter,
        });
        setEvents(res);
      } catch (err) {
        console.error('Failed to load audit events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [actorFilter, eventFilter]);

  const handleReset = () => {
    setActorFilter('All');
    setEventFilter('All');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
          Activity & Compliance Audit Trail
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Append-only compliance log tracking every operational signal, agent finding, and human decision.
        </p>
      </div>

      <div
        className="sg-card"
        style={{
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label htmlFor="audit-actor" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Actor:
          </label>
          <select
            id="audit-actor"
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">All Actors</option>
            <option value="Human">Human Operators</option>
            <option value="Agent">Autonomous Agents</option>
            <option value="System">System Telemetry</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label htmlFor="audit-type" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Event:
          </label>
          <select
            id="audit-type"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">All Events</option>
            <option value="Approval">Approvals & Decisions</option>
            <option value="Evidence">Evidence Appended</option>
            <option value="Assessment">Assessments</option>
            <option value="Case">Case Creation</option>
          </select>
        </div>

        <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ height: '34px' }}>
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      <div className="sg-card">
        {loading ? (
          <LoadingSpinner message="Filtering audit events..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No audit events found"
            description="No compliance records match your current filter selection."
            action={
              <button onClick={handleReset} className="btn btn-secondary btn-sm">
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="data-table-container">
            <table className="data-table" aria-label="System Audit Events">
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Case ID</th>
                  <th scope="col">Actor & Role</th>
                  <th scope="col">Event Type</th>
                  <th scope="col">Action Summary</th>
                  <th scope="col">Mutation Diff</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="font-mono" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {formatTimeAgo(e.timestamp)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {formatDateTime(e.timestamp)}
                      </div>
                    </td>
                    <td>
                      {e.caseId !== 'SYSTEM' ? (
                        <button
                          onClick={() => navigate(`/disruptions/${e.caseId}`)}
                          className="code-tag font-bold"
                          style={{ cursor: 'pointer', color: 'var(--color-primary)' }}
                        >
                          {e.caseId}
                        </button>
                      ) : (
                        <span className="code-tag text-muted">SYSTEM</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              e.actorType === 'Human'
                                ? '#EFF6FF'
                                : e.actorType === 'Agent'
                                ? '#F5F3FF'
                                : '#FEF3C7',
                            color:
                              e.actorType === 'Human'
                                ? '#1D4ED8'
                                : e.actorType === 'Agent'
                                ? '#6D28D9'
                                : '#92400E',
                          }}
                        >
                          {e.actorType}
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--color-navy)' }}>
                          {e.actorName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 'semibold' }}>{e.eventType}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {e.summary}
                      </span>
                    </td>
                    <td>
                      <span className="code-tag text-xs" style={{ color: '#0F766E' }}>
                        {e.diff || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
