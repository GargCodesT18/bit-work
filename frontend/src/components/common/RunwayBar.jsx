/**
 * SupplyGuard Stockout Runway Depletion Bar
 * Antimetal Achromatic Palette — Uses Bistre, Graphite, Quill, and Chartreuse Whisper.
 * Zero saturated red, green, or blue.
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function RunwayBar({ days = 0, maxDays = 7, safetyStockDays = 4.0 }) {
  const safeDays = typeof days === 'number' && !isNaN(days) ? days : 0;
  const barRef = useRef(null);
  const percentage = Math.min(100, Math.max(0, (safeDays / maxDays) * 100));
  const isCritical = safeDays <= 2.0;
  const isWarning = safeDays > 2.0 && safeDays < safetyStockDays;

  // Antimetal Palette: Bistre for critical focus, Graphite for warning, Ash/Quill for baseline
  const barColor = isCritical
    ? '#1a1614' // Bistre
    : isWarning
    ? '#53504c' // Slate
    : '#1a1614'; // Bistre healthy

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
          height: '6px',
          backgroundColor: 'var(--color-quill, #e3e3de)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
        title={`${safeDays.toFixed(1)} Days Runway (Safety Threshold: ${safetyStockDays}d)`}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',
            borderRadius: '9999px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '0.04em',
          color: 'var(--color-graphite, #66635f)',
          marginTop: '4px',
        }}
      >
        <span>0d</span>
        <span>
          Mandate: {safetyStockDays}d
        </span>
        <span>{maxDays}d+</span>
      </div>
    </div>
  );
}

export default RunwayBar;
