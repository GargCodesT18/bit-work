/**
 * SupplyGuard Landing Page Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const siteNav = document.querySelector('.site-nav');

  if (mobileBtn && siteNav) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('mobile-open');
    });
  }

  // Interactive Product UI Preview Tabs
  const pills = document.querySelectorAll('.preview-pill');
  const stages = document.querySelectorAll('.preview-stage');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetStage = pill.getAttribute('data-stage');

      pills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      stages.forEach(s => s.classList.remove('active'));

      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const activeStage = document.getElementById(targetStage);
      if (activeStage) {
        activeStage.classList.add('active');
      }
    });
  });
});
