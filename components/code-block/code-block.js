let template;
let audioContext;

async function loadTemplate() {
  if (!template) {
    const response = await fetch(
      "/components/code-block/code-block.html",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load code-block.html",
      );
    }

    template = await response.text();
  }

  return template;
}

/* ========================================
   HTML ESCAPE
======================================== */

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ========================================
   CREATE CODE LINES
======================================== */

function createLines(code) {
  return code
    .split("\n")
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
    .join("");
}

/* ========================================
   LINE SOUND
======================================== */

function playLineSound() {
  const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(
    700,
    audioContext.currentTime,
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    400,
    audioContext.currentTime + 0.06,
  );

  gain.gain.setValueAtTime(
    0.08,
    audioContext.currentTime,
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.06,
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.06,
  );
}

/* ========================================
   CREATE CODE BLOCK
======================================== */

export async function createCodeBlock({
  code,
  language = "javascript",
  speed = 900,
}) {
  const html = await loadTemplate();

  const codeHtml = createLines(code);

  const blockHtml = html
    .replaceAll(
      "{{language}}",
      escapeHtml(language),
    )
    .replace("{{code}}", codeHtml);

  const wrapper = document.createElement("div");

  wrapper.innerHTML = blockHtml.trim();

  const component = wrapper.firstElementChild;

  if (!component) {
    throw new Error(
      "Failed to create code block.",
    );
  }

  /* ========================================
     ELEMENTS
  ======================================== */

  const lineElements = [
    ...component.querySelectorAll(
      ".code-block__line",
    ),
  ];

  const previousButton =
    component.querySelector(
      ".code-block__previous",
    );

  const nextButton =
    component.querySelector(
      ".code-block__next",
    );

  const playButton =
    component.querySelector(
      ".code-block__play",
    );

  const copyButton =
    component.querySelector(
      ".code-block__copy",
    );

  const currentLineElement =
    component.querySelector(
      ".code-block__current-line",
    );

  const totalLinesElement =
    component.querySelector(
      ".code-block__total-lines",
    );

  /* ========================================
     STATE
  ======================================== */

  let currentLine = 1;

  let isPlaying = false;

  let playTimer = null;

  /* ========================================
     TOTAL LINES
  ======================================== */

  totalLinesElement.textContent =
    lineElements.length;

  /* ========================================
     UPDATE LINE
  ======================================== */

  function updateLine() {
    lineElements.forEach((line) => {
      const lineNumber = Number(
        line.dataset.line,
      );

      line.classList.toggle(
        "code-block__line--active",
        lineNumber === currentLine,
      );
    });

    currentLineElement.textContent =
      currentLine;

    previousButton.disabled =
      currentLine === 1;

    nextButton.disabled =
      currentLine === lineElements.length;
  }

  /* ========================================
     STOP PLAYBACK
  ======================================== */

  function stopPlaying() {
    isPlaying = false;

    clearTimeout(playTimer);

    playTimer = null;

    playButton.textContent = "▶";

    playButton.title = "Play";

    playButton.classList.remove(
      "code-block__play--playing",
    );
  }

  /* ========================================
     PLAY NEXT LINE
  ======================================== */

  function playNextLine() {
    if (!isPlaying) {
      return;
    }

    if (
      currentLine >=
      lineElements.length
    ) {
      stopPlaying();

      return;
    }

    playTimer = setTimeout(() => {
      if (!isPlaying) {
        return;
      }

      currentLine += 1;

      playLineSound();

      updateLine();

      playNextLine();
    }, speed);
  }

  /* ========================================
     PLAY / PAUSE
  ======================================== */

  function togglePlay() {
    if (isPlaying) {
      stopPlaying();

      return;
    }

    /*
     * Start from the beginning
     */

    currentLine = 1;

    isPlaying = true;

    playButton.textContent = "⏸";

    playButton.title = "Pause";

    playButton.classList.add(
      "code-block__play--playing",
    );

    playLineSound();

    updateLine();

    playNextLine();
  }

  /* ========================================
     PREVIOUS
  ======================================== */

  previousButton.addEventListener(
    "click",
    () => {
      /*
       * Stop autoplay when manually
       * navigating.
       */

      if (isPlaying) {
        stopPlaying();
      }

      if (currentLine <= 1) {
        return;
      }

      currentLine -= 1;

      playLineSound();

      updateLine();
    },
  );

  /* ========================================
     NEXT
  ======================================== */

  nextButton.addEventListener(
    "click",
    () => {
      /*
       * Stop autoplay when manually
       * navigating.
       */

      if (isPlaying) {
        stopPlaying();
      }

      if (
        currentLine >=
        lineElements.length
      ) {
        return;
      }

      currentLine += 1;

      playLineSound();

      updateLine();
    },
  );

  /* ========================================
     PLAY BUTTON
  ======================================== */

  playButton.addEventListener(
    "click",
    togglePlay,
  );

  /* ========================================
     COPY
  ======================================== */

  copyButton.addEventListener(
    "click",
    async () => {
      try {
        await navigator.clipboard.writeText(
          code,
        );

        const originalText =
          copyButton.textContent;

        copyButton.textContent =
          "Copied!";

        setTimeout(() => {
          copyButton.textContent =
            originalText;
        }, 1200);
      } catch (error) {
        console.error(
          "Failed to copy code:",
          error,
        );
      }
    },
  );

  /* ========================================
     INITIAL STATE
  ======================================== */

  updateLine();

  return component;
}