/**
 * SupplyGuard Navigation Helpers
 * Global keyboard shortcuts, route synchronization, and deep linking
 */

const Navigation = {
  init() {
    this.bindKeyboardShortcuts();
  },

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // '/' shortcut to focus search when not in input
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        const searchInput = document.getElementById('global-search-input') || document.getElementById('cases-search-input');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }
};

window.Navigation = Navigation;
document.addEventListener('DOMContentLoaded', () => Navigation.init());
