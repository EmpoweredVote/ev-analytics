import { defineConfig } from 'tsup';

export default defineConfig({
  // Core is React-free; the React bindings (error boundary) are a separate
  // entry so non-React consumers never pull React into their bundle.
  entry: ['src/index.ts', 'src/react.tsx'],
  format: ['esm', 'cjs'],
  // Ship declarations — the typed event catalog is the whole point.
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2019',
  // Peer deps — never bundle them.
  external: ['posthog-js', 'react', 'react/jsx-runtime'],
});
