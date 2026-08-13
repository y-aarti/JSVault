const sidebar = document.querySelector('#sidebar');

const sidebarLinks = [
  {
    label: 'Home',
    icon: '🧠',
    href: '#/home',
    active: true,
  },
  {
    label: 'Execution Context',
    icon: '🧠',
    href: '#/execution-context',
    active: false,
  },
];

export function initSidebar() {
  const sidebar = document.querySelector('#sidebar');

  sidebarLinks.forEach((link) => {
    sidebar.insertAdjacentHTML(
      'beforeend',
      `
        <a href="${link.href}" class="sidebar__link">
          <span class="sidebar__icon">${link.icon}</span>
          <span>${link.label}</span>
        </a>
      `,
    );
  });
}
