import { createServer } from 'node:net'
import { spawn } from 'cross-spawn'
import kleur from 'kleur'
import { t } from '../i18n/index.js'

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
    console.log(kleur.cyan(`🚀 ${t('dashboard.running', { port: PORT })}`))
    return
  }

  console.log(kleur.cyan(`🚀 ${t('dashboard.launching', { port: PORT })}`))

  const child = spawn('npx', ['@trimly/dashboard'], {
    env: { ...process.env, PORT: String(PORT) },
    detached: true,
    stdio: 'ignore',
  })
  child.unref()

  console.log(kleur.green(`   ${t('dashboard.started', { pid: child.pid ?? 0, port: PORT })}`))
}
