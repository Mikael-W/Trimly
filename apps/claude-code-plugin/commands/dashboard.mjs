#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'

const PORT = 3737

async function isPortFree(port) {
  return new Promise((resolve) => {
    const server = createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port)
  })
}

async function main() {
  const free = await isPortFree(PORT)
  if (!free) {
    process.stdout.write(`🚀 Trimly dashboard already running: http://localhost:${PORT}\n`)
    return
  }

  process.stdout.write(`🚀 Launching Trimly dashboard on http://localhost:${PORT}...\n`)

  const child = spawn('npx', ['@trimly/dashboard'], {
    env: { ...process.env, PORT: String(PORT) },
    detached: true,
    stdio: 'ignore',
  })
  child.unref()

  process.stdout.write(`   Dashboard started (PID ${child.pid}). Open http://localhost:${PORT}\n`)
}

main().catch((err) => {
  process.stderr.write(`[Trimly dashboard error] ${err}\n`)
  process.exit(1)
})
