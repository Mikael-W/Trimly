import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import bg from './locales/bg.json' with { type: 'json' }
import cs from './locales/cs.json' with { type: 'json' }
import da from './locales/da.json' with { type: 'json' }
import de from './locales/de.json' with { type: 'json' }
import el from './locales/el.json' with { type: 'json' }
import en from './locales/en.json' with { type: 'json' }
import es from './locales/es.json' with { type: 'json' }
import et from './locales/et.json' with { type: 'json' }
import fi from './locales/fi.json' with { type: 'json' }
import fr from './locales/fr.json' with { type: 'json' }
import ga from './locales/ga.json' with { type: 'json' }
import hr from './locales/hr.json' with { type: 'json' }
import hu from './locales/hu.json' with { type: 'json' }
import it from './locales/it.json' with { type: 'json' }
import lt from './locales/lt.json' with { type: 'json' }
import lv from './locales/lv.json' with { type: 'json' }
import mt from './locales/mt.json' with { type: 'json' }
import nl from './locales/nl.json' with { type: 'json' }
import pl from './locales/pl.json' with { type: 'json' }
import pt from './locales/pt.json' with { type: 'json' }
import ro from './locales/ro.json' with { type: 'json' }
import sk from './locales/sk.json' with { type: 'json' }
import sl from './locales/sl.json' with { type: 'json' }
import sv from './locales/sv.json' with { type: 'json' }

type Messages = Record<string, string>

const MESSAGES: Record<string, Messages> = {
  en,
  fr,
  bg,
  cs,
  da,
  de,
  el,
  es,
  et,
  fi,
  ga,
  hr,
  hu,
  it,
  lt,
  lv,
  mt,
  nl,
  pl,
  pt,
  ro,
  sk,
  sl,
  sv,
}

let current = 'en'

function envLocale(): string {
  const raw = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || ''
  return raw.split(/[._]/)[0] ?? ''
}

function configLocale(): string | undefined {
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), '.trimly', 'config.json'), 'utf8'))
    return cfg.locale
  } catch {
    return undefined
  }
}

/** Resolve the CLI locale: TRIMLY_LOCALE → config.locale → system LANG → en. */
export function initLocale(explicit?: string): void {
  const candidate = explicit || process.env.TRIMLY_LOCALE || configLocale() || envLocale()
  current = candidate && MESSAGES[candidate] ? candidate : 'en'
}

export function t(key: string, params?: Record<string, string | number>): string {
  let s = MESSAGES[current]?.[key] ?? MESSAGES.en?.[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replaceAll(`{${k}}`, String(v))
    }
  }
  return s
}
