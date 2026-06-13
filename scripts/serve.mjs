// 零相依靜態伺服器:自動找空埠 + 開瀏覽器。不需要 npm install。
//   開發(原始碼):node scripts/serve.mjs .
//   預覽 build:    node scripts/serve.mjs site
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, normalize } from 'node:path'
import { spawn } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const rootDir = join(here, '..', process.argv[2] || '.')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (path.endsWith('/')) path += 'index.html'
    const file = join(rootDir, normalize(path))
    if (!file.startsWith(rootDir)) {
      res.writeHead(403).end('Forbidden')
      return
    }
    const info = await stat(file).catch(() => null)
    if (!info || !info.isFile()) {
      const html = await readFile(join(rootDir, 'index.html'))
      res.writeHead(200, { 'Content-Type': MIME['.html'] }).end(html)
      return
    }
    const body = await readFile(file)
    res
      .writeHead(200, {
        'Content-Type': MIME[extname(file)] || 'application/octet-stream',
      })
      .end(body)
  } catch (e) {
    res.writeHead(500).end(String(e))
  }
})

// 從 5180 起往上找空埠(避開約拿 5173/5174、保羅 5173)。
function listen(port) {
  return new Promise((resolve, reject) => {
    const onErr = (e) => {
      server.removeListener('listening', onOk)
      reject(e)
    }
    const onOk = () => {
      server.removeListener('error', onErr)
      resolve(port)
    }
    server.once('error', onErr)
    server.once('listening', onOk)
    server.listen(port, '0.0.0.0')
  })
}

let port = 5180
for (let i = 0; i < 50; i++) {
  try {
    await listen(port)
    break
  } catch (e) {
    if (e && e.code === 'EADDRINUSE') {
      port++
      continue
    }
    throw e
  }
}

const url = `http://localhost:${port}/`
console.log(`聖經遊戲大廳:${url}`)
console.log('（保持這個視窗開著;關掉視窗即停止伺服器）')
if (process.platform === 'win32') {
  spawn('cmd', ['/c', 'start', '', url], {
    stdio: 'ignore',
    detached: true,
  }).unref()
}
