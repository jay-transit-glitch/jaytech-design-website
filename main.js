document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Toggle Logic (Desktop & Mobile)
  // ==========================================
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleBtnMobile = document.getElementById('theme-toggle-mobile');
  const currentTheme = localStorage.getItem('theme') || 'light';

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      if (toggleBtn) toggleBtn.textContent = '☀️ Light Mode';
      if (toggleBtnMobile) toggleBtnMobile.textContent = '☀️ Light Mode';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      if (toggleBtn) toggleBtn.textContent = '🌙 Dark Mode';
      if (toggleBtnMobile) toggleBtnMobile.textContent = '🌙 Dark Mode';
    }
  }

  // Apply saved theme on page load
  updateThemeUI(currentTheme);

  // Toggle handler function
  function handleThemeToggle() {
    let activeTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    updateThemeUI(newTheme);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', handleThemeToggle);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', handleThemeToggle);

  // ==========================================
  // 2. Mobile Sidebar Slide-Out Controls
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function openMenu() {
    if (mobileSidebar && sidebarOverlay) {
      mobileSidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling when open
    }
  }

  function closeMenu() {
    if (mobileSidebar && sidebarOverlay) {
      mobileSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore normal scrolling
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (closeSidebar) closeSidebar.addEventListener('click', closeMenu);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMenu);
});