import { createServer } from 'node:net'
import { spawn } from 'cross-spawn'
import kleur from 'kleur'

const PORT = 3737

async function isPortFree(port: number): Promise<boolean> {
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

export async function cmdDashboard(): Promise<void> {
  const free = await isPortFree(PORT)

  if (!free) {
    console.log(kleur.cyan(`🚀 Trimly dashboard is already running: http://localhost:${PORT}`))
    return
  }

  console.log(kleur.cyan(`🚀 Launching Trimly dashboard on http://localhost:${PORT}...`))

  const child = spawn('npx', ['@trimly/dashboard'], {
    env: { ...process.env, PORT: String(PORT) },
    detached: true,
    stdio: 'ignore',
  })
  child.unref()

  console.log(kleur.green(`   Dashboard started (PID ${child.pid}). Open http://localhost:${PORT}`))
}
