#!/usr/bin/env node
// 실행 환경: Node.js (macOS/Linux/Windows 공통)

import { promises as fs } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, '.claude');
const targetDir = path.join(rootDir, '.codex');
const sourceGuideFile = path.join(rootDir, 'CLAUDE.md');
const targetGuideFile = path.join(rootDir, 'CODEX.md');
const isCheckMode = process.argv.includes('--check');

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(baseDir, relDir = '.') {
  const currentDir = path.join(baseDir, relDir);
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const nextRelPath = path.join(relDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(baseDir, nextRelPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(nextRelPath);
    }
  }

  return files.sort();
}

async function removeExtraFiles(baseDir, allowedFiles) {
  if (!(await pathExists(baseDir))) {
    return;
  }

  const existingFiles = await collectFiles(baseDir);
  const allowedSet = new Set(allowedFiles);

  for (const relPath of existingFiles) {
    if (!allowedSet.has(relPath)) {
      await fs.rm(path.join(baseDir, relPath), { force: true });
    }
  }
}

async function syncFiles() {
  if (!(await pathExists(sourceDir))) {
    throw new Error('source directory ".claude" not found');
  }

  await fs.mkdir(targetDir, { recursive: true });

  const sourceFiles = await collectFiles(sourceDir);
  const changedFiles = [];

  for (const relPath of sourceFiles) {
    const fromPath = path.join(sourceDir, relPath);
    const toPath = path.join(targetDir, relPath);
    const toDir = path.dirname(toPath);

    await fs.mkdir(toDir, { recursive: true });

    const sourceContent = await fs.readFile(fromPath, 'utf8');
    let previousContent = null;

    if (await pathExists(toPath)) {
      previousContent = await fs.readFile(toPath, 'utf8');
    }

    if (previousContent !== sourceContent) {
      changedFiles.push(relPath);
      if (!isCheckMode) {
        await fs.writeFile(toPath, sourceContent, 'utf8');
      }
    }
  }

  if (!isCheckMode) {
    await removeExtraFiles(targetDir, sourceFiles);
  }

  return { sourceFiles, changedFiles };
}

async function syncRootGuide() {
  if (!(await pathExists(sourceGuideFile))) {
    return false;
  }

  const sourceContent = await fs.readFile(sourceGuideFile, 'utf8');
  const previousContent = (await pathExists(targetGuideFile))
    ? await fs.readFile(targetGuideFile, 'utf8')
    : null;

  if (sourceContent === previousContent) {
    return false;
  }

  if (isCheckMode) {
    return true;
  }

  await fs.writeFile(targetGuideFile, sourceContent, 'utf8');
  return true;
}

async function main() {
  const { sourceFiles, changedFiles } = await syncFiles();
  const didGuideChange = await syncRootGuide();

  if (isCheckMode) {
    if (changedFiles.length > 0 || didGuideChange) {
      console.error('[sync-ai-config] out of sync files:');
      for (const relPath of changedFiles) {
        console.error(`- ${relPath}`);
      }
      if (didGuideChange) {
        console.error('- CODEX.md');
      }
      process.exit(1);
    }

    console.log('[sync-ai-config] .claude and .codex are in sync');
    return;
  }

  console.log(`[sync-ai-config] synchronized ${sourceFiles.length} files`);
  if (changedFiles.length > 0) {
    console.log(`[sync-ai-config] updated ${changedFiles.length} file(s) in .codex`);
  } else {
    console.log('[sync-ai-config] no updates were needed in .codex');
  }

  if (didGuideChange) {
    console.log('[sync-ai-config] updated CODEX.md from CLAUDE.md');
  }
}

main().catch((error) => {
  console.error('[sync-ai-config] failed:', error.message);
  process.exit(1);
});
