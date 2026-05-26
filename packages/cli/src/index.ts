import { Command } from 'commander'
import { cmdClear } from './commands/clear.js'
import { cmdDashboard } from './commands/dashboard.js'
import { cmdExport } from './commands/export.js'
import { cmdImportBrowser } from './commands/import-browser.js'
import { cmdInit } from './commands/init.js'
import { cmdStats } from './commands/stats.js'
import { initLocale, t } from './i18n/index.js'

initLocale()

const program = new Command().name('trimly').description(t('cli.desc')).version('0.2.0')

program.command('init').description(t('init.desc')).action(cmdInit)

program
  .command('stats')
  .description(t('stats.desc'))
  .option('--db <path>', t('opt.db'))
  .option('--days <n>', t('opt.days'), '30')
  .action((opts) => cmdStats({ db: opts.db, days: Number.parseInt(opts.days, 10) }))

program.command('dashboard').description(t('dashboard.desc')).action(cmdDashboard)

program
  .command('clear')
  .description(t('clear.desc'))
  .option('--db <path>', t('opt.db'))
  .option('-y, --yes', t('opt.yes'))
  .action((opts) => cmdClear({ db: opts.db, yes: opts.yes }))

program
  .command('export')
  .description(t('export.desc'))
  .option('--db <path>', t('opt.db'))
  .option('-o, --output <path>', t('opt.output'))
  .option('--format <fmt>', t('opt.format'), 'json')
  .action((opts) => cmdExport({ db: opts.db, output: opts.output, format: opts.format }))

program
  .command('import-browser <file>')
  .description(t('importBrowser.desc'))
  .option('--db <path>', t('opt.db'))
  .action((file: string, opts) => cmdImportBrowser(file, { db: opts.db }))

program.parse()
