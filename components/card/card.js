let template;

async function loadTemplate() {
  if (!template) {
    const response = await fetch('/components/card/card.html', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to load card template');
    }

    template = await response.text();
  }

  return template;
}

export async function createTopicCard(topic) {
  const html = await loadTemplate();

  const cardHtml = html
    .replaceAll('{{icon}}', topic.icon)
    .replaceAll('{{title}}', topic.title)
    .replaceAll('{{description}}', topic.description)
    .replaceAll('{{level}}', topic.level)
    .replaceAll('{{href}}', topic.href);

  const wrapper = document.createElement('div');

  wrapper.innerHTML = cardHtml.trim();

  return wrapper.firstElementChild;
}
