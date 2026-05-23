import { createInterface } from 'node:readline'
import kleur from 'kleur'
import { openStorage } from '../utils/findStorage.js'

interface ClearOptions {
  db?: string
  yes?: boolean
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'o')
    })
  })
}

export async function cmdClear(options: ClearOptions = {}): Promise<void> {
  const ok =
    options.yes || (await confirm(kleur.yellow('⚠️  Supprimer tous les events Trimly? (y/N) ')))

  if (!ok) {
    console.log('Annulé.')
    return
  }

  const storage = await openStorage(options.db)

  const s = storage as unknown as {
    client?: { execute(sql: string): Promise<unknown> }
    db?: { exec(sql: string): void }
  }

  if (s.client) {
    await s.client.execute('DELETE FROM events')
    await s.client.execute('DELETE FROM sessions')
  } else if (s.db) {
    s.db.exec('DELETE FROM events; DELETE FROM sessions;')
  }

  await storage.close()
  console.log(kleur.green('✅ Données Trimly supprimées.'))
}
