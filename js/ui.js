const app = document.querySelector('#app');
function themeButton() { return `<button class="theme-toggle" id="themeToggle" aria-label="Rang rejimini almashtirish">☾</button>`; }
function bindTheme() {
  document.querySelector('#themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('bilimsinov-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}
function setupTheme() { if (localStorage.getItem('bilimsinov-theme') === 'dark') document.body.classList.add('dark'); }
