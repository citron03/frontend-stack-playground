#!/usr/bin/env node
// 실행 환경: Node.js (macOS/Linux/Windows 공통)
import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const root = process.cwd();
const workspaceYaml = path.join(root, 'pnpm-workspace.yaml');

async function loadWorkspace() {
  const raw = await fs.readFile(workspaceYaml, 'utf8');
  return yaml.load(raw) || {};
}

async function findPackageJsons(dir) {
  const results = [];
  async function walk(cur) {
    const entries = await fs.readdir(cur, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name === 'package.json') {
        results.push(full);
      }
    }
  }
  try {
    await walk(dir);
  } catch (e) {
    // ignore
  }
  return results;
}

function pickCatalogForPkg(catalogs, defaultCatalog, pkgName, preferOrder) {
  // preferOrder: array of catalog names in priority order
  for (const name of preferOrder) {
    const cat = catalogs?.[name];
    if (cat && Object.prototype.hasOwnProperty.call(cat, pkgName)) return { catalogName: name };
  }
  // fallback to any catalog that has the key
  if (catalogs) {
    for (const name of Object.keys(catalogs)) {
      const cat = catalogs[name];
      if (cat && Object.prototype.hasOwnProperty.call(cat, pkgName)) return { catalogName: name };
    }
  }
  // check default catalog
  if (defaultCatalog && Object.prototype.hasOwnProperty.call(defaultCatalog, pkgName))
    return { catalogName: 'default' };
  return null;
}

async function updatePackageJson(file, catalogs, defaultCatalog, preferOrder, dry) {
  const raw = await fs.readFile(file, 'utf8');
  const obj = JSON.parse(raw);
  const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  let changed = false;
  const logs = [];

  for (const sec of sections) {
    if (!obj[sec]) continue;
    for (const dep of Object.keys(obj[sec])) {
      const pick = pickCatalogForPkg(catalogs, defaultCatalog, dep, preferOrder);
      if (pick) {
        const desired = pick.catalogName === 'default' ? 'catalog:' : `catalog:${pick.catalogName}`;
        if (obj[sec][dep] !== desired) {
          logs.push(`${path.relative(root, file)}: ${sec} ${dep}: ${obj[sec][dep]} -> ${desired}`);
          obj[sec][dep] = desired;
          changed = true;
        }
      }
    }
  }
  if (changed && !dry) {
    await fs.writeFile(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  }
  return { changed, logs };
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry') || args.includes('-d');

  const ws = await loadWorkspace();
  const defaultCatalog = ws.catalog || {};
  const catalogs = ws.catalogs || {};

  // set a preferred order so that more specific groups win when a package appears in multiple catalogs
  const preferOrder = [
    'framework',
    'storybook',
    'mdx',
    'vanilla-extract',
    'testing',
    'eslint',
    'style-and-format',
    'tools',
    'types',
    'utilities',
  ];

  // gather package.json under workspace packages
  const searchDirs =
    ws.packages && Array.isArray(ws.packages)
      ? ws.packages.map((p) => p.replace(/\*$/, '').replace(/\/$/, ''))
      : ['apps', 'packages'];
  const pkgFiles = new Set();
  for (const d of searchDirs) {
    const dir = path.join(root, d || '');
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) {
        const found = await findPackageJsons(dir);
        found.forEach((f) => pkgFiles.add(f));
      }
    } catch (e) {
      // ignore missing
    }
  }

  // optionally include root package.json? Don't modify root by default
  // const rootPkg = path.join(root, 'package.json'); pkgFiles.add(rootPkg);

  if (pkgFiles.size === 0) {
    console.log('No package.json files found in workspace package directories.');
    return;
  }

  let anyChanged = false;
  for (const file of pkgFiles) {
    const { changed, logs } = await updatePackageJson(
      file,
      catalogs,
      defaultCatalog,
      preferOrder,
      dry,
    );
    logs.forEach((l) => console.log(l));
    anyChanged = anyChanged || changed;
  }

  if (dry) {
    console.log('\n--dry run: no files were modified.');
  } else {
    console.log(
      anyChanged
        ? '\nApplied catalog references to package.json files.'
        : '\nNo changes applied (already using catalogs or no matching catalog entries).',
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
