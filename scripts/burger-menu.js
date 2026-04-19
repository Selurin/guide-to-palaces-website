document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger-btn');
  const nav = document.querySelector('.nav-container');
  const menu = document.querySelector('.menu-list');
  const menuLinks = document.querySelectorAll('.menu-item');

  if (!burger || !nav) return;

  // Открытие/закрытие
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    menu.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Закрытие при клике на пункт меню
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Закрытие при клике вне меню
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
     closeMenu();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
  });

  function closeMenu() {
    burger.classList.remove('active');
    menu.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }
});