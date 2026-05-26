import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CORE_RANGE = '^0.3.0'

export function ensureCore(pluginRoot) {
  if (existsSync(join(pluginRoot, 'node_modules', '@trimly', 'core', 'package.json'))) return
  const depsDir = join(pluginRoot, '.deps')
  if (existsSync(join(depsDir, 'node_modules', '@trimly', 'core', 'package.json'))) return
  try {
    mkdirSync(depsDir, { recursive: true })
    writeFileSync(
      join(depsDir, 'package.json'),
      JSON.stringify({
        name: 'trimly-deps',
        private: true,
        dependencies: { '@trimly/core': CORE_RANGE },
      }),
    )
    execFileSync(
      'npm',
      ['install', '--prefix', depsDir, '--no-audit', '--no-fund', '--loglevel=error'],
      { stdio: 'ignore' },
    )
  } catch (err) {
    if (process.env.TRIMLY_DEBUG) process.stderr.write(`[Trimly ensure-core] ${err}\n`)
  }
}
