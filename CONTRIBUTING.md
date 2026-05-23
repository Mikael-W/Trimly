# Contributing to Trimly

Thanks for your interest in improving Trimly! Issues, ideas, and pull requests are all welcome.

## Prerequisites

- **Node.js >= 20**
- **pnpm** (this is a pnpm workspace monorepo): `npm install -g pnpm`

## Setup

```bash
git clone https://github.com/Mikael-W/Trimly.git
cd Trimly
pnpm install
```

## Monorepo layout

```
packages/core        @trimly/core — tokenization, pricing, storage, optimization
packages/cli         @trimly/cli  — the `trimly` binary
packages/dashboard   local Nuxt dashboard
apps/claude-code-plugin   hooks, slash commands, status line
apps/browser-extension    claude.ai token badge + optimize overlay
```

## Common commands

All tasks run through [Turborepo](https://turbo.build):

```bash
pnpm turbo build        # build every package
pnpm turbo typecheck    # tsc --noEmit everywhere
pnpm turbo test         # run the test suites
pnpm turbo lint         # Biome check
```

Before opening a PR, make sure this is green:

```bash
pnpm turbo build typecheck test lint
```

## Code style

- Formatting and linting are handled by [Biome](https://biomejs.dev). Run `pnpm turbo lint` (use `pnpm exec biome check --write <path>` to auto-fix).
- TypeScript is strict. Prefer no `any` and no non-null assertions (`!`) — narrow types instead.

## Tests

Tests use [Vitest](https://vitest.dev) with a **BDD Given/When/Then** structure: nested `describe` blocks for *Given* and *When*, with the assertion in a `test` at the leaf.

```ts
describe('computeCost', () => {
  describe('Given an Anthropic model', () => {
    describe('When input and output tokens are provided', () => {
      test('Then it returns the summed cost', () => {
        // ...
      })
    })
  })
})
```

Add or update tests for any behavior change.

## Pull requests

1. Branch off the latest `develop`.
2. Keep changes focused; one concern per PR.
3. Use [Conventional Commit](https://www.conventionalcommits.org) prefixes: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
4. Ensure `pnpm turbo build typecheck test lint` passes.
5. Open the PR against `develop` with a clear description of what and why.

## License

By contributing, you agree that your contributions are licensed under the [Apache 2.0 License](./LICENSE).
