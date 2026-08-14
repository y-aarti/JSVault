import { initHome } from '../pages/home/home.js';
import { initExecutionContext } from '../pages/execution-context/execution-context.js';

const routes = {
  '/home': {
    html: 'pages/home/home.html',
    init: initHome,
  },

  '/execution-context': {
    html: 'pages/execution-context/execution-context.html',
    init: initExecutionContext,
  },
};

async function navigate() {
  const path = window.location.hash.slice(1) || '/home';
  const route = routes[path];
  const page = route.html;

  if (!page) {
    console.error(`Route not found: ${path}`);
    return;
  }

  try {
    const response = await fetch(page);

    if (!response.ok) {
      throw new Error(`Failed to load ${page}`);
    }

    const html = await response.text();
    document.querySelector('#main-content').innerHTML = html;

    if (route.init) {
      await route.init();
    }

    updateActiveLink(path);
  } catch (error) {
    console.error(error);
  }
}

function updateActiveLink(currentPath) {
  document.querySelectorAll('.sidebar__link').forEach((link) => {
    const linkPath = link.getAttribute('href').replace('#', '');

    link.classList.toggle('sidebar__link--active', linkPath === currentPath);
  });
}

export function initRouter() {
  window.addEventListener('hashchange', navigate);

  navigate();
}
