import fs from 'node:fs'

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
}

const pkg = readJson('package.json')
const version = pkg.version

const versionFile = 'public/version.json'
const versionData = readJson(versionFile)
versionData.version = version
fs.writeFileSync(versionFile, `${JSON.stringify(versionData, null, 2)}\n`, 'utf8')

const swFile = 'public/sw.js'
const sw = fs.readFileSync(swFile, 'utf8')
const cacheName = `netforge-shell-v${version.replace(/\D/g, '')}`
const nextSw = sw.replace(
  /const CACHE_NAME = '[^']+'/,
  `const CACHE_NAME = '${cacheName}'`,
)
fs.writeFileSync(swFile, nextSw, 'utf8')

const readmeFile = 'README.md'
const readme = fs.readFileSync(readmeFile, 'utf8')
const nextReadme = readme.replace(
  /Versi aplikasi saat ini: \*\*[^*]+\*\*/,
  `Versi aplikasi saat ini: **${version}**`,
)
fs.writeFileSync(readmeFile, nextReadme, 'utf8')

console.log(`Synced version ${version} (${cacheName})`)
