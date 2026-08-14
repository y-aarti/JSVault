let stylesLoaded = false;

function loadStyles() {
  if (stylesLoaded) {
    return;
  }

  const link = document.createElement('link');

  link.rel = 'stylesheet';
  link.href = '/components/call-stack/call-stack.css';

  document.head.appendChild(link);

  stylesLoaded = true;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createCodeLines(code) {
  return code
    .split('\n')
    .map((line, index) => {
      const lineNumber = index + 1;

      return `
        <div
          class="call-stack__code-line"
          data-line="${lineNumber}"
        >
          <span class="call-stack__line-number">
            ${lineNumber}
          </span>

          <code class="call-stack__line-content">
            ${escapeHtml(line) || '&nbsp;'}
          </code>
        </div>
      `;
    })
    .join('');
}

function renderStack(stack) {
  if (!stack || stack.length === 0) {
    return `
      <div class="call-stack__empty">
        Call Stack is empty
      </div>
    `;
  }

  return stack
    .slice()
    .reverse()
    .map(
      (context, index) => `
        <div
          class="call-stack__stack-item ${
            index === 0 ? 'call-stack__stack-item--active' : ''
          }"
        >
          ${escapeHtml(context)}
        </div>
      `,
    )
    .join('');
}

function renderEnvironment(environment) {
  if (!environment || Object.keys(environment).length === 0) {
    return `
      <div class="call-stack__environment-empty">
        No active environment
      </div>
    `;
  }

  return Object.entries(environment)
    .map(
      ([key, value]) => `
        <div class="call-stack__environment-item">
          <span class="call-stack__environment-key">
            ${escapeHtml(key)}
          </span>

          <span class="call-stack__environment-arrow">
            →
          </span>

          <span class="call-stack__environment-value">
            ${escapeHtml(value)}
          </span>
        </div>
      `,
    )
    .join('');
}

function updateCodeHighlight(container, line) {
  container
    .querySelectorAll('.call-stack__code-line')
    .forEach((codeLine) => {
      codeLine.classList.remove('call-stack__code-line--active');
    });

  if (!line) {
    return;
  }

  const activeLine = container.querySelector(
    `.call-stack__code-line[data-line="${line}"]`,
  );

  if (activeLine) {
    activeLine.classList.add('call-stack__code-line--active');
  }
}

function updateStep(container, step) {
  const phaseElement = container.querySelector(
    '.call-stack__phase',
  );

  const titleElement = container.querySelector(
    '.call-stack__step-title',
  );

  const detailsElement = container.querySelector(
    '.call-stack__details',
  );

  const stackElement = container.querySelector(
    '.call-stack__stack',
  );

  const environmentElement = container.querySelector(
    '.call-stack__environment',
  );

  const nextButton = container.querySelector(
    '.call-stack__next',
  );

  if (phaseElement) {
    phaseElement.textContent = step.phase || '';
    phaseElement.className = 'call-stack__phase';

    if (step.phase === 'Creation Phase') {
      phaseElement.classList.add(
        'call-stack__phase--creation',
      );
    }

    if (step.phase === 'Execution Phase') {
      phaseElement.classList.add(
        'call-stack__phase--execution',
      );
    }
  }

  if (titleElement) {
    titleElement.textContent = step.title || '';
  }

  if (detailsElement) {
    detailsElement.innerHTML = (step.details || [])
      .map(
        (detail) => `
          <div class="call-stack__detail">
            ${escapeHtml(detail)}
          </div>
        `,
      )
      .join('');
  }

  if (stackElement) {
    stackElement.innerHTML = renderStack(step.stack);
  }

  if (environmentElement) {
    environmentElement.innerHTML = renderEnvironment(
      step.environment,
    );
  }

  updateCodeHighlight(container, step.line);

  if (nextButton) {
    const isLastStep =
      container.dataset.currentStep ===
      container.dataset.totalSteps - 1;

    nextButton.textContent = isLastStep
      ? 'Restart'
      : 'Next →';
  }
}

export async function createCallStack({
  code,
  steps = [],
}) {
  loadStyles();

  const container = document.createElement('div');

  container.className = 'call-stack';

  container.innerHTML = `
    <div class="call-stack__header">
      <div>
        <div class="call-stack__label">
          Execution Visualizer
        </div>

        <h3 class="call-stack__title">
          JavaScript Execution
        </h3>
      </div>

      <div class="call-stack__step-counter">
        Step <span class="call-stack__current-step">1</span>
        /
        <span class="call-stack__total-steps">
          ${steps.length}
        </span>
      </div>
    </div>

    <div class="call-stack__body">

      <!-- CODE -->
      <section class="call-stack__code-section">

        <div class="call-stack__section-title">
          Source Code
        </div>

        <div class="call-stack__code">
          ${createCodeLines(code)}
        </div>

      </section>

      <!-- VISUALIZATION -->
      <section class="call-stack__visual-section">

        <div class="call-stack__phase">
        </div>

        <h4 class="call-stack__step-title">
        </h4>

        <div class="call-stack__details">
        </div>

        <!-- CALL STACK -->

        <div class="call-stack__panel">

          <div class="call-stack__panel-title">
            Call Stack
          </div>

          <div class="call-stack__stack">
          </div>

        </div>

        <!-- ENVIRONMENT -->

        <div class="call-stack__panel">

          <div class="call-stack__panel-title">
            Current Environment
          </div>

          <div class="call-stack__environment">
          </div>

        </div>

      </section>

    </div>

    <div class="call-stack__footer">

      <button
        type="button"
        class="call-stack__next"
      >
        Next →
      </button>

    </div>
  `;

  let currentStep = 0;

  container.dataset.currentStep = currentStep;
  container.dataset.totalSteps = steps.length;

  const currentStepElement = container.querySelector(
    '.call-stack__current-step',
  );

  const nextButton = container.querySelector(
    '.call-stack__next',
  );

  function showStep(index) {
    if (!steps.length) {
      return;
    }

    currentStep = index;

    container.dataset.currentStep = currentStep;

    if (currentStepElement) {
      currentStepElement.textContent = currentStep + 1;
    }

    updateStep(
      container,
      steps[currentStep],
    );
  }

  nextButton.addEventListener('click', () => {
    if (!steps.length) {
      return;
    }

    if (currentStep >= steps.length - 1) {
      showStep(0);
      return;
    }

    showStep(currentStep + 1);
  });

  showStep(0);

  return container;
}