// scripts/generate-manifests.mjs
import { readdir, writeFile } from "node:fs/promises";
import { extname } from "node:path";

const IMG_EXTS = new Set([".png",".jpg",".jpeg",".gif",".webp",".avif",".svg"]);
const FOLDERS = ["images/memes", "images/examples"];

async function listImages(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  return items
    .filter(d => d.isFile() && IMG_EXTS.has(extname(d.name).toLowerCase()))
    .sort((a,b) => a.name.localeCompare(b.name))
    .map(d => `${dir}/${encodeURIComponent(d.name)}`);
}

for (const folder of FOLDERS) {
  const files = await listImages(folder);
  await writeFile(`${folder}/manifest.json`, JSON.stringify(files, null, 2));
  console.log(`Wrote ${folder}/manifest.json (${files.length} items)`);
}

