import { createTopicCard } from '../../components/card/card.js';

const topics = [
  {
    icon: 'JS',
    title: 'Execution Context',
    description:
      'Understand how JavaScript creates and manages execution contexts, the call stack, and execution phases.',
    level: 'Beginner',
    href: '#/execution-context',
  },
  {
    icon: 'JS',
    title: 'Hoisting',
    description:
      'Understand how JavaScript handles variable and function declarations before execution.',
    level: 'Beginner',
    href: '#/hoisting',
  },
];

export async function initHome() {
  const container = document.querySelector('#topic-cards');

  if (!container) {
    return;
  }

  const cards = await Promise.all(
    topics.map((topic) => createTopicCard(topic)),
  );

  container.innerHTML = '';

  cards.forEach((card) => {
    container.appendChild(card);
  });
}
