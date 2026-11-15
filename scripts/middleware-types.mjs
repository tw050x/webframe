// Writes defineMiddleware's overloads into packages/node/core/src/middleware.ts, between its
// <generated> markers: one for each length of chain up to TYPED_CHAIN_LENGTH, and one for longer
// chains. `--check` only says whether the file is up to date (the tests run it).
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../packages/node/core/src/middleware.ts', import.meta.url);
const source = readFileSync(file, 'utf8');
const length = Number(/export const TYPED_CHAIN_LENGTH = (\d+);/.exec(source)?.[1]);
if (!length) throw new Error('TYPED_CHAIN_LENGTH not found in middleware.ts');

const T = (i) => `T${i}`;
const params = (n) => Array.from({ length: n }, (_, i) => `  ${T(i + 1)} extends ServiceRequestContext`).join(',\n');
const before = (i) => i === 0 ? 'ServiceRequestContext' : `ServiceRequestContext & NoInfer<${Array.from({ length: i }, (_, j) => T(j + 1)).join(' & ')}>`;
const typed = (n) => Array.from({ length: n }, (_, i) => `    Middleware<${before(i)}, ${T(i + 1)}>`);

const overloads = [];
for (let n = 1; n <= length; n++) {
  overloads.push(`export function defineMiddleware<\n${params(n)}\n>(\n  middlewares: [\n${typed(n).join(',\n')}\n  ]\n): RouteHandler;`);
}
// Longer chains: the first ones typed, the rest given all they added and anything else, untyped.
// It needs more than TYPED_CHAIN_LENGTH middleware, so a mistake in a shorter chain can't match it.
const rest = `Middleware<${before(length)} & Untyped>`;
overloads.push(`export function defineMiddleware<\n${params(length)}\n>(\n  middlewares: [\n${typed(length).join(',\n')},\n    ${rest},\n    ...${rest}[]\n  ]\n): RouteHandler;`);

const block = `// <generated: npm run middleware-types>
// One overload for each length of chain up to TYPED_CHAIN_LENGTH, and one for longer chains.
// Each middleware's input is everything the ones before it added; NoInfer keeps TypeScript from
// guessing those from the inputs, so each is inferred from what its middleware says it adds.
${overloads.join('\n')}
// </generated>`;

const updated = source.replace(/\/\/ <generated: npm run middleware-types>[\s\S]*?\/\/ <\/generated>/, block);
if (process.argv.includes('--check')) {
  if (updated !== source) {
    console.error('middleware.ts is out of date: run npm run middleware-types');
    process.exit(1);
  }
}
else {
  writeFileSync(file, updated);
}
