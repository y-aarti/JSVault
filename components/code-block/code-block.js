let template;

async function loadTemplate() {
  if (!template) {
    const response = await fetch('components/code-block/code-block.html');

    if (!response.ok) {
      throw new Error('Failed to load code block template');
    }

    template = await response.text();
  }

  return template;
}

function playLineSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';

  oscillator.frequency.setValueAtTime(700, audioContext.currentTime);

  oscillator.frequency.exponentialRampToValueAtTime(
    400,
    audioContext.currentTime + 0.06,
  );

  gain.gain.setValueAtTime(0.08, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.06,
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(audioContext.currentTime + 0.06);
}

function escapeHtml(code) {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function createLines(code) {
  return code
    .split('\n')
    .map(
      (line, index) => `
        <div
          class="code-block__line"
          data-line="${index + 1}"
        >
          <span class="code-block__line-number">
            ${index + 1}
          </span>

          <span class="code-block__line-code">
            ${escapeHtml(line)}
          </span>
        </div>
      `,
    )
    .join('');
}

export async function createCodeBlock({ code, language = 'javascript' }) {
  const html = await loadTemplate();

  const codeBlockHtml = html
    .replace('{{language}}', language)
    .replace('{{code}}', createLines(code));

  const wrapper = document.createElement('div');

  wrapper.innerHTML = codeBlockHtml.trim();

  const codeBlock = wrapper.firstElementChild;

  const lineElements = [...codeBlock.querySelectorAll('.code-block__line')];

  const previousButton = codeBlock.querySelector('.code-block__previous');

  const nextButton = codeBlock.querySelector('.code-block__next');

  const copyButton = codeBlock.querySelector('.code-block__copy');

  const currentLineElement = codeBlock.querySelector(
    '.code-block__current-line',
  );

  const totalLinesElement = codeBlock.querySelector('.code-block__total-lines');

  let currentLine = 1;

  totalLinesElement.textContent = lineElements.length;

  function updateLine() {
    lineElements.forEach((line) => {
      line.classList.toggle(
        'code-block__line--active',
        Number(line.dataset.line) === currentLine,
      );
    });

    currentLineElement.textContent = currentLine;

    previousButton.disabled = currentLine === 1;

    nextButton.disabled = currentLine === lineElements.length;
  }

  previousButton.addEventListener('click', () => {
    if (currentLine > 1) {
      currentLine -= 1;
      playLineSound();
      updateLine();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentLine < lineElements.length) {
      currentLine += 1;
      playLineSound();
      updateLine();
    }
  });

  copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(code);

    copyButton.textContent = 'Copied!';

    setTimeout(() => {
      copyButton.textContent = 'Copy';
    }, 1500);
  });

  updateLine();

  return codeBlock;
}
