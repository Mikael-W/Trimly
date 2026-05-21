import { Command } from 'commander'
import { cmdInit } from './commands/init.js'
import { cmdStats } from './commands/stats.js'
import { cmdDashboard } from './commands/dashboard.js'
import { cmdClear } from './commands/clear.js'
import { cmdExport } from './commands/export.js'
import { cmdImportBrowser } from './commands/import-browser.js'

const program = new Command()
  .name('trimly')
  .description('See and trim your AI token spend')
  .version('0.1.0')

program
  .command('init')
  .description('Initialize Trimly config and storage directory')
  .action(cmdInit)

program
  .command('stats')
  .description('Show token usage and cost statistics')
  .option('--db <path>', 'Custom database path')
  .option('--days <n>', 'Number of days to show', '30')
  .action((opts) => cmdStats({ db: opts.db, days: parseInt(opts.days, 10) }))

program
  .command('dashboard')
  .description('Launch the Trimly dashboard at http://localhost:3737')
  .action(cmdDashboard)

program
  .command('clear')
  .description('Delete all tracked events (with confirmation)')
  .option('--db <path>', 'Custom database path')
  .option('-y, --yes', 'Skip confirmation')
  .action((opts) => cmdClear({ db: opts.db, yes: opts.yes }))

program
  .command('export')
  .description('Export events to JSON or CSV')
  .option('--db <path>', 'Custom database path')
  .option('-o, --output <path>', 'Output file path')
  .option('--format <fmt>', 'Output format: json or csv', 'json')
  .action((opts) => cmdExport({ db: opts.db, output: opts.output, format: opts.format }))

program
  .command('import-browser <file>')
  .description('Import events exported from the browser extension')
  .option('--db <path>', 'Custom database path')
  .action((file: string, opts) => cmdImportBrowser(file, { db: opts.db }))

program.parse()
