import { createCallStack } from '../../components/call-stack/call-stack.js';

const code = `const name = "Aarti";

function greet(name) {
  console.log("Hello " + name);
}

greet(name);`;

const steps = [
  {
    type: 'CREATION_PHASE',

    phase: 'Creation Phase',

    line: null,

    title: 'Global Execution Context is created',

    details: [
      'JavaScript creates the Global Execution Context.',
      'Before executing the code, the engine prepares the environment.',
      'This is called the Creation Phase.',
    ],

    environment: {
      name: 'uninitialized',
      greet: 'function',
      this: 'global object',
    },

    stack: ['Global()'],
  },

  {
    type: 'EXECUTION_PHASE',

    phase: 'Execution Phase',

    line: 1,

    title: 'name gets its value',

    details: [
      'The Creation Phase is complete.',
      'JavaScript now starts executing the code from the top.',
      'The const declaration creates name.',
      'name receives the value "Aarti".',
    ],

    environment: {
      name: '"Aarti"',
      greet: 'function',
      this: 'global object',
    },

    stack: ['Global()'],
  },

  {
    type: 'FUNCTION_DECLARATION',

    phase: 'Execution Phase',

    line: 3,

    title: 'greet() declaration is encountered',

    details: [
      'JavaScript reaches the greet() function declaration.',
      'The function was already prepared during the Creation Phase.',
      'JavaScript does not execute the function body here.',
      'Execution continues to the next statement.',
    ],

    environment: {
      name: '"Aarti"',
      greet: 'function',
      this: 'global object',
    },

    stack: ['Global()'],
  },

  {
    type: 'FUNCTION_CALL',

    phase: 'Execution Phase',

    line: 7,

    title: 'greet(name) is called',

    details: [
      'JavaScript reaches the function call.',
      'A new Function Execution Context is created for greet().',
      'The greet() context is pushed onto the Call Stack.',
      'The argument "Aarti" is passed to the name parameter.',
    ],

    environment: {
      name: '"Aarti"',
    },

    stack: [
      'Global()',
      'greet()',
    ],
  },

  {
    type: 'CREATION_PHASE',

    phase: 'Creation Phase',

    line: 3,

    title: 'greet() Creation Phase',

    details: [
      'A new Execution Context has been created for greet().',
      'Its Creation Phase runs before the function body executes.',
      'The parameter name is created.',
      'The parameter receives the argument "Aarti".',
    ],

    environment: {
      name: '"Aarti"',
      this: 'global object',
    },

    stack: [
      'Global()',
      'greet()',
    ],
  },

  {
    type: 'EXECUTION_PHASE',

    phase: 'Execution Phase',

    line: 4,

    title: 'greet() starts executing',

    details: [
      'The greet() Creation Phase is complete.',
      'JavaScript starts executing the function body.',
      'The expression "Hello " + name is evaluated.',
      'The result is "Hello Aarti".',
    ],

    environment: {
      name: '"Aarti"',
      this: 'global object',
    },

    stack: [
      'Global()',
      'greet()',
    ],
  },

  {
    type: 'EXECUTION_PHASE',

    phase: 'Execution Phase',

    line: 4,

    title: 'console.log() executes',

    details: [
      'console.log() receives "Hello Aarti".',
      'The value is printed to the console.',
      'There is no more code inside greet().',
    ],

    environment: {
      name: '"Aarti"',
    },

    stack: [
      'Global()',
      'greet()',
    ],
  },

  {
    type: 'FUNCTION_RETURN',

    phase: 'Execution Phase',

    line: 4,

    title: 'greet() finishes',

    details: [
      'The greet() function has finished executing.',
      'Its Execution Context is removed from the Call Stack.',
      'Execution returns to the Global Execution Context.',
    ],

    environment: {
      name: '"Aarti"',
      greet: 'function',
    },

    stack: ['Global()'],
  },

  {
    type: 'COMPLETE',

    phase: 'Execution Phase',

    line: null,

    title: 'Execution is complete',

    details: [
      'There is no more global code to execute.',
      'The Global Execution Context finishes.',
      'It is removed from the Call Stack.',
      'The Call Stack is now empty.',
    ],

    environment: {},

    stack: [],
  },
];


export async function initExecutionContext() {
  const container = document.querySelector('#code-example');

  if (!container) {
    return;
  }

  container.innerHTML = '';

  const callStack = await createCallStack({
    code,
    steps,
  });

  container.appendChild(callStack);
}