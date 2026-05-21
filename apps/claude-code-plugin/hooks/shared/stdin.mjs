/** Read all of stdin and parse as JSON. Returns null on failure. */
export async function readStdinJson() {
  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => { data += chunk })
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(null)
      }
    })
    process.stdin.on('error', () => resolve(null))
    // Timeout safety: if no data after 1s, bail
    setTimeout(() => resolve(null), 1000)
  })
}
