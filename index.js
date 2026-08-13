import { loadComponent } from './utils/load-components.js';
import { initSidebar } from './components/sidebar/sidebar.js';
import { initRouter } from './js/router.js';

async function init() {
  const sidebar = await loadComponent('/components/sidebar/sidebar.html');
  const content = await loadComponent(
    '/pages/execution-context/execution-context.html',
  );
  const main = `<main class="main">
  <header class="main__header"></header>

  <section id="main-content" class="main__content">
    ${content}
  </section>
</main>`;

  document.querySelector('#app').innerHTML = `
    ${sidebar}

    ${main}
  `;
  initSidebar();
  initRouter();
}

init();
