/**
 * SupplyGuard Stockout Runway Depletion Bar
 * Uses GSAP to smoothly animate runway width adjustments.
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function RunwayBar({ days = 0, maxDays = 7, safetyStockDays = 4.0 }) {
  const safeDays = typeof days === 'number' && !isNaN(days) ? days : 0;
  const barRef = useRef(null);
  const percentage = Math.min(100, Math.max(0, (safeDays / maxDays) * 100));
  const isCritical = safeDays <= 2.0;
  const isWarning = safeDays > 2.0 && safeDays < safetyStockDays;

  const barColor = isCritical
    ? 'var(--color-critical)'
    : isWarning
    ? 'var(--color-warning)'
    : 'var(--color-teal)';

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${percentage}%`,
        backgroundColor: barColor,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, [percentage, barColor]);

  return (
    <div style={{ width: '100%', marginTop: '6px' }}>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#E2E8F0',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
        title={`${safeDays.toFixed(1)} Days Runway (Safety Threshold: ${safetyStockDays}d)`}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%', // Animates via GSAP
            borderRadius: 'var(--radius-full)',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          marginTop: '3px',
        }}
      >
        <span>0d (Stockout)</span>
        <span style={{ color: isWarning || isCritical ? 'var(--color-warning)' : 'inherit' }}>
          Mandate: {safetyStockDays}d
        </span>
        <span>{maxDays}d+</span>
      </div>
    </div>
  );
}
