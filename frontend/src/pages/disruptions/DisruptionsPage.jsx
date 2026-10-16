/**
 * SupplyGuard Disruption Cases Catalog Page
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Plus, ArrowUpDown } from 'lucide-react';
import { getCases } from '../../services/cases/caseService.js';
import { RiskBadge } from '../../components/common/RiskBadge.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { TriggerBadge } from '../../components/common/TriggerBadge.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { formatTimeAgo, formatDateTime } from '../../utils/formatters.js';

export function DisruptionsPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters from query params or local defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [triggerFilter, setTriggerFilter] = useState('All');
  const [sortBy, setSortBy] = useState('risk');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getCases({
          search,
          risk: riskFilter,
          status: statusFilter,
          disruptionType: typeFilter,
          triggerSource: triggerFilter,
          sortBy,
        });
        setCases(data);
      } catch (err) {
        console.error('Failed to load disruption cases:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, riskFilter, statusFilter, typeFilter, triggerFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setRiskFilter('All');
    setStatusFilter('All');
    setTypeFilter('All');
    setTriggerFilter('All');
    setSortBy('risk');
    setSearchParams({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-bistre)', letterSpacing: '-0.02em' }}>
            Disruption Cases
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Active operational disruptions under investigation, formulation, and human approval.
          </p>
        </div>

        <button
          onClick={() => navigate('/monitoring')}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Report a Disruption</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="sg-card"
        style={{
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search ID, supplier, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', width: '100%', height: '34px', fontSize: '13px' }}
            />
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">Risk: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">Status: All</option>
            <option value="Investigating">Investigating</option>
            <option value="Planning">Planning</option>
            <option value="AwaitingApproval">Awaiting Approval</option>
            <option value="Approved">Approved</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">Type: All</option>
            <option value="Supplier Delay">Supplier Delay</option>
            <option value="Warehouse Shutdown">Warehouse Shutdown</option>
            <option value="Transport Disruption">Transport Disruption</option>
            <option value="Demand Spike">Demand Spike</option>
          </select>

          {/* Trigger Filter */}
          <select
            value={triggerFilter}
            onChange={(e) => setTriggerFilter(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="All">Trigger: All</option>
            <option value="Proactive">Proactive Signal</option>
            <option value="Reported">Reported Alert</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="sort-select" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ height: '34px', fontSize: '13px' }}
          >
            <option value="risk">Highest Risk First</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button
            onClick={handleResetFilters}
            className="btn btn-secondary btn-sm"
            title="Reset active filters"
            style={{ height: '34px' }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Disruption Cases Table */}
      <div className="sg-card">
        {loading ? (
          <LoadingSpinner message="Filtering disruption cases..." />
        ) : cases.length === 0 ? (
          <EmptyState
            title="No matching disruption cases"
            description="No cases match your filter criteria. Try clearing filters or reporting a new disruption."
            action={
              <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="data-table-container">
            <table className="data-table" aria-label="Disruption Cases Table">
              <thead>
                <tr>
                  <th scope="col">Case ID</th>
                  <th scope="col">Incident Description</th>
                  <th scope="col">Supplier & Shipment</th>
                  <th scope="col">Product & Nodes</th>
                  <th scope="col">Risk Level</th>
                  <th scope="col">Status & Trigger</th>
                  <th scope="col">Detected / Reported</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    className="row-interactive"
                    onClick={() => navigate(`/disruptions/${c.id}`)}
                  >
                    <td>
                      <span className="code-tag font-bold">{c.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-bistre)' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {c.disruptionType}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{c.supplier?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {c.shipment?.poNumber} • {c.shipment?.carrier}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{c.product?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {c.impactAssessment?.locations?.map((l) => l.name.split('(')[0].trim()).join(', ')}
                      </div>
                    </td>
                    <td>
                      <RiskBadge risk={c.risk} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <StatusBadge status={c.status} size="sm" />
                        <TriggerBadge source={c.triggerSource} size="sm" />
                      </div>
                    </td>
                    <td>
                      <div className="font-mono" style={{ fontSize: '12px' }}>
                        {formatTimeAgo(c.createdAt)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {formatDateTime(c.createdAt).split(' ')[0]}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/disruptions/${c.id}`);
                        }}
                      >
                        Inspect →
                      </button>
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
