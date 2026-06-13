// 「建置」= 把可部署的靜態檔複製到 site/(不打包,純 ES 模組瀏覽器直接跑)。
//
// ⚠ 這台 Windows + Node 24:「遞迴」cpSync / rmSync 會讓行程無聲被殺(exit 127),
//    所以這裡只用單檔 copyFileSync + 逐層 readdir 自己走訪,完全避開遞迴 API。
//    (與 hfpc-jonah-game 同一套作法。)
// 執行:npm run build
import {
  readdirSync,
  copyFileSync,
  mkdirSync,
  unlinkSync,
  rmdirSync,
  existsSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'site')

function rmrf(p) {
  if (!existsSync(p)) return
  for (const ent of readdirSync(p, { withFileTypes: true })) {
    const f = join(p, ent.name)
    if (ent.isDirectory()) rmrf(f)
    else {
      try {
        unlinkSync(f)
      } catch {}
    }
  }
  try {
    rmdirSync(p)
  } catch {}
}

function copyDir(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true })
  for (const ent of readdirSync(srcDir, { withFileTypes: true })) {
    const s = join(srcDir, ent.name)
    const d = join(destDir, ent.name)
    if (ent.isDirectory()) copyDir(s, d)
    else copyFileSync(s, d)
  }
}

rmrf(out)
mkdirSync(out, { recursive: true })

copyFileSync(join(root, 'index.html'), join(out, 'index.html'))
copyFileSync(join(root, 'styles.css'), join(out, 'styles.css'))
copyDir(join(root, 'src'), join(out, 'src'))
// public/ 內容(manifest、sw.js、favicon、icon)複製到 site 根目錄
copyDir(join(root, 'public'), out)

console.log('✓ 已產生 site/ —— 可直接上傳到 Netlify 等任何靜態主機')
