import { createCodeBlock } from '../../components/code-block/code-block.js';

export async function initExecutionContext() {
  const container = document.querySelector('#code-example');
  const codeBlock = await createCodeBlock({
    language: 'javascript',
    code: `const name = "Aarti";

function greet(name) {
  console.log("Hello " + name);
}

greet(name);
`,
  });

  const codeBlock2 = await createCodeBlock({
    language: 'javascript',
    code: `function outer() {
  let count = 0;

  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();

counter();
counter();
`,
  });

  container.appendChild(codeBlock);
  container.appendChild(codeBlock2);
}
