#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { readStdinJson } from './shared/stdin.mjs'

async function main() {
  const input = await readStdinJson()
  if (!input) process.exit(0)

  const { session_id = '', transcript_path = '' } = input
  if (!session_id) process.exit(0)

  try {
    const pluginRoot = process.env['CLAUDE_PLUGIN_ROOT'] ?? join(homedir(), '.claude', 'plugins', 'trimly')
    let core
    try {
      core = await import(join(pluginRoot, 'node_modules', '@trimly/core', 'dist', 'index.js'))
    } catch {
      core = await import('@trimly/core')
    }

    const { computeCost, createStorage, getDefaultDbPath } = core

    // Parse transcript to get real usage
    const usage = await extractUsageFromTranscript(transcript_path)

    const dbPath = process.env['TRIMLY_DB_PATH'] ?? getDefaultDbPath()
    const storage = await createStorage(dbPath)

    // Find the pending event for this session
    const pending = await storage.queryEvents({ session_id, status: 'pending', limit: 1 })

    if (pending.length > 0) {
      const event = pending[0]
      const model = event.model
      const provider = event.provider

      const costUsd = computeCost(provider, model, {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_read_input_tokens: usage.cache_read_input_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens,
      })

      await storage.updateEvent(event.id, {
        tokens_input: usage.input_tokens,
        tokens_output: usage.output_tokens,
        tokens_cache_read: usage.cache_read_input_tokens ?? 0,
        tokens_cache_write: usage.cache_creation_input_tokens ?? 0,
        cost_usd: costUsd,
        status: 'completed',
        duration_ms: usage.duration_ms ?? null,
      })
    }

    await storage.close()
  } catch (err) {
    if (process.env['TRIMLY_DEBUG']) {
      process.stderr.write(`[Trimly stop error] ${err}\n`)
    }
  }

  process.exit(0)
}

async function extractUsageFromTranscript(transcriptPath) {
  if (!transcriptPath) return defaultUsage()

  try {
    const raw = await readFile(transcriptPath, 'utf8')
    const lines = raw.trim().split('\n').filter(Boolean)

    // Find the last assistant message with usage
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const msg = JSON.parse(lines[i])
        if (msg.role === 'assistant' && msg.usage) {
          return {
            input_tokens: msg.usage.input_tokens ?? 0,
            output_tokens: msg.usage.output_tokens ?? 0,
            cache_read_input_tokens: msg.usage.cache_read_input_tokens ?? 0,
            cache_creation_input_tokens: msg.usage.cache_creation_input_tokens ?? 0,
            duration_ms: null,
          }
        }
        // Also handle API response format
        if (msg.type === 'message' && msg.usage) {
          return {
            input_tokens: msg.usage.input_tokens ?? 0,
            output_tokens: msg.usage.output_tokens ?? 0,
            cache_read_input_tokens: msg.usage.cache_read_input_tokens ?? 0,
            cache_creation_input_tokens: msg.usage.cache_creation_input_tokens ?? 0,
            duration_ms: null,
          }
        }
      } catch {
        continue
      }
    }
  } catch {
    // transcript not readable
  }

  return defaultUsage()
}

function defaultUsage() {
  return {
    input_tokens: 0,
    output_tokens: 0,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
    duration_ms: null,
  }
}

main()
