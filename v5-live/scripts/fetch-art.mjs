import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(base, '../assets');
const manifest = JSON.parse(await fs.readFile(path.join(assets, 'artwork-manifest.json'), 'utf8'));
const allowed = new Set(['brand','love_rose','love_pearl','wedding_silk','wedding_garden','birthday_aurora','apology_rain','proposal_pearl']);
let downloaded = 0;

for (const [name, urlString] of Object.entries(manifest)) {
  if (!allowed.has(name)) throw new Error('Unexpected artwork name: ' + name);
  const output = path.join(assets, name + '.jpg');
  try {
    const existing = await fs.readFile(output);
    if (existing.length > 12000 && existing[0] === 0xff && existing[1] === 0xd8) {
      console.log('Already local:', name); continue;
    }
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const url = new URL(urlString);
  if (url.hostname !== 'dnznrvs05pmza.cloudfront.net' || url.protocol !== 'https:') throw new Error('Artwork host rejected');
  console.log('Fetching original artwork:', name);
  const response = await fetch(url, { signal: AbortSignal.timeout(65000), redirect: 'error' });
  if (!response.ok) throw new Error(name + ' asset fetch HTTP ' + response.status);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 12000 || buffer.length > 9 * 1024 * 1024) throw new Error(name + ' invalid asset size');
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[buffer.length - 2] !== 0xff || buffer[buffer.length - 1] !== 0xd9) throw new Error(name + ' expected a valid JPEG');
  await fs.writeFile(output + '.tmp', buffer, { mode: 0o644 });
  await fs.rename(output + '.tmp', output);
  downloaded++;
  console.log('Saved:', name, Math.round(buffer.length/1024), 'KB');
}
console.log('Verified', Object.keys(manifest).length, 'first-party EMORA artwork files (' + downloaded + ' new).');
