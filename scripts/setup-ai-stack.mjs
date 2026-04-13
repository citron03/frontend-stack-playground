#!/usr/bin/env node
// 실행 환경: Node.js (macOS/Linux/Windows 공통)

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const claudeDir = path.join(rootDir, '.claude');
const aiDir = path.join(claudeDir, 'ai');
const syncScript = path.join(rootDir, 'scripts', 'sync-ai-config.mjs');
const checkOnly = process.argv.includes('--check');

const requiredCommands = ['node', 'pnpm', 'git', 'rg'];
const blockedTokens = ['curl', 'wget', 'http://', 'https://', 'ssh://', ';', '&&', '||', '|'];

const baseMcpPolicy = {
  version: 1,
  securityBaseline: {
    networkAccess: 'deny-by-default',
    secretHandling: 'env-only',
    filesystemScope: 'workspace-only',
    vendorWrite: false,
    patchesWrite: false,
  },
  servers: [
    {
      id: 'workspace-files-readonly',
      kind: 'local-policy',
      purpose: '프로젝트 코드/문서 조회',
      enabled: true,
      readOnly: true,
      allowedPaths: ['apps/**', 'docs/**', 'scripts/**', '.claude/**'],
    },
    {
      id: 'git-metadata-readonly',
      kind: 'local-policy',
      purpose: '변경점/이력 확인',
      enabled: true,
      readOnly: true,
      allowedGitCommands: ['git status', 'git diff', 'git log --oneline', 'git show'],
    },
    {
      id: 'shell-safe-readonly',
      kind: 'local-policy',
      purpose: '빠른 탐색/정적 분석',
      enabled: true,
      readOnly: true,
      allowedCommands: ['rg', 'find', 'sed -n', 'cat', 'ls'],
    },
  ],
};

const pluginPolicy = {
  version: 1,
  policy: {
    installation: 'allowlist-only',
    authentication: 'on-install',
    remotePlugins: false,
  },
  plugins: [
    {
      id: 'repo-workflow',
      type: 'local-command-pack',
      enabled: true,
      commands: ['pnpm web:dev', 'pnpm tanstack:dev', 'pnpm ds:dev', 'pnpm typecheck'],
      risk: 'low',
    },
    {
      id: 'quality-gates',
      type: 'local-command-pack',
      enabled: true,
      commands: ['pnpm lint', 'pnpm format', 'pnpm stylelint', 'pnpm test'],
      risk: 'low',
    },
    {
      id: 'ai-config-sync',
      type: 'local-command-pack',
      enabled: true,
      commands: ['pnpm ai:sync-config', 'pnpm ai:check-config-sync', 'pnpm ai:setup-stack'],
      risk: 'low',
    },
  ],
};

const multiAgentPolicy = {
  version: 1,
  enabled: true,
  defaults: {
    maxParallelAgents: 2,
    allowDelegation: true,
    requireDisjointWriteScope: true,
    blockingTaskDelegation: false,
  },
  roles: [
    {
      id: 'explorer',
      responsibility: '코드 탐색/원인 파악',
      canWrite: false,
    },
    {
      id: 'worker',
      responsibility: '명확한 파일 범위 구현',
      canWrite: true,
      restrictions: ['vendor/** 금지', 'patches/** 금지'],
    },
  ],
};

function buildAiSettings(projectName, packageManager, appNames) {
  return {
    version: 1,
    project: {
      name: projectName,
      packageManager,
      monorepo: true,
      apps: appNames,
    },
    guardrails: {
      strictTypeScript: true,
      testStrategy: 'app-scoped-first',
      dependencyPolicy: 'no-latest-no-unknown-remote',
      docsFirst: ['docs/PROJECT_CONVENTIONS.md', 'docs/ARCHITECTURE.md'],
    },
  };
}

function buildAnalysisReport(appNames) {
  const appLine = appNames.length > 0 ? appNames.join(', ') : 'apps 디렉토리에서 앱을 찾지 못함';
  return `# AI Stack Analysis

작성일: managed-by-ai-setup-stack

## 프로젝트 특성 요약
- monorepo: pnpm workspace + turbo
- 앱 축: ${appLine}
- 운영 문서: docs/*에 구조/테스트/보안/의존성 규약 명시

## 보안 기준
- 외부 원격 플러그인 비활성화
- MCP는 로컬/읽기 중심 정책으로 제한
- vendor/, patches/는 쓰기 금지
- 비밀정보는 env 기반만 허용

## 자동화 범위
- .claude/ai/* 정책 파일 자동 생성
- sync-ai-config를 통해 .codex/CODEX.md 동기화
- ai-setup 스킬/커맨드 제공
`;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeJson(filePath, value) {
  const next = JSON.stringify(value, null, 2) + '\n';
  if (checkOnly) {
    const current = await fs.readFile(filePath, 'utf8').catch(() => null);
    return current === next;
  }
  await fs.writeFile(filePath, next, 'utf8');
  return true;
}

async function writeText(filePath, value) {
  if (checkOnly) {
    const current = await fs.readFile(filePath, 'utf8').catch(() => null);
    return current === value;
  }
  await fs.writeFile(filePath, value, 'utf8');
  return true;
}

async function commandExists(command) {
  try {
    await execFileAsync('sh', ['-lc', `command -v ${command}`], { cwd: rootDir });
    return true;
  } catch {
    return false;
  }
}

function validatePolicyCommands(commands) {
  return commands.every((cmd) => blockedTokens.every((token) => !cmd.includes(token)));
}

function validatePolicySafety(mcpPolicy) {
  const dangerousCommands = mcpPolicy.servers.flatMap((server) => {
    const commands = [...(server.allowedCommands ?? []), ...(server.allowedGitCommands ?? [])];
    return commands.map((command) => ({ command, readOnly: server.readOnly !== false }));
  });

  for (const { command, readOnly } of dangerousCommands) {
    if (command.startsWith('sed') && command !== 'sed -n') {
      throw new Error('only "sed -n" is allowed in MCP policy');
    }

    if (!readOnly && (command.startsWith('sed') || command.startsWith('pnpm'))) {
      throw new Error('write-capable MCP server cannot include sed/pnpm commands');
    }
  }
}

async function loadProjectMetadata() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const appsDir = path.join(rootDir, 'apps');
  const appsEntries = await fs.readdir(appsDir, { withFileTypes: true }).catch(() => []);
  const appCandidates = appsEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const appNames = [];
  for (const appName of appCandidates) {
    const appPackageJson = path.join(appsDir, appName, 'package.json');
    // 앱으로 간주되는 기준: apps/<name>/package.json 존재
    if (await fs.access(appPackageJson).then(() => true).catch(() => false)) {
      appNames.push(appName);
    }
  }
  appNames.sort();

  const packageManager = typeof packageJson.packageManager === 'string'
    ? packageJson.packageManager.split('@')[0]
    : 'pnpm';

  const projectName = typeof packageJson.name === 'string' && packageJson.name.length > 0
    ? packageJson.name
    : path.basename(rootDir);

  const scripts = typeof packageJson.scripts === 'object' && packageJson.scripts !== null
    ? packageJson.scripts
    : {};

  return { projectName, packageManager, appNames, scripts };
}

function deriveTestCommands(scripts) {
  const preferred = ['web:test', 'tanstack:test', 'ds:test', 'test'];
  return preferred.filter((key) => typeof scripts[key] === 'string').map((key) => `pnpm ${key}`);
}

async function run() {
  const { projectName, packageManager, appNames, scripts } = await loadProjectMetadata();
  const aiSettings = buildAiSettings(projectName, packageManager, appNames);
  const analysisReport = buildAnalysisReport(appNames);
  const mcpPolicy = JSON.parse(JSON.stringify(baseMcpPolicy));
  const derivedTestCommands = deriveTestCommands(scripts);
  if (derivedTestCommands.length > 0) {
    mcpPolicy.servers.push({
      id: 'test-execution-readonly',
      kind: 'local-policy',
      purpose: '테스트 실행 및 검증',
      enabled: true,
      readOnly: true,
      allowedCommands: derivedTestCommands,
    });
  }

  const missing = [];
  for (const cmd of requiredCommands) {
    if (!(await commandExists(cmd))) {
      missing.push(cmd);
    }
  }

  if (missing.length > 0) {
    throw new Error(`required commands not found: ${missing.join(', ')}`);
  }

  const allPluginCommands = pluginPolicy.plugins.flatMap((plugin) => plugin.commands);
  const allMcpCommands = mcpPolicy.servers.flatMap((server) => [
    ...(server.allowedCommands ?? []),
    ...(server.allowedGitCommands ?? []),
  ]);
  const allPolicyCommands = [...allPluginCommands, ...allMcpCommands];

  if (!validatePolicyCommands(allPolicyCommands)) {
    throw new Error('policy contains blocked remote/network command token');
  }

  validatePolicySafety(mcpPolicy);

  await ensureDir(aiDir);

  const files = [
    [path.join(aiDir, 'settings.json'), () => writeJson(path.join(aiDir, 'settings.json'), aiSettings)],
    [path.join(aiDir, 'mcp.policy.json'), () =>
      writeJson(path.join(aiDir, 'mcp.policy.json'), mcpPolicy)],
    [path.join(aiDir, 'plugins.policy.json'), () =>
      writeJson(path.join(aiDir, 'plugins.policy.json'), pluginPolicy)],
    [path.join(aiDir, 'multi-agent.policy.json'), () =>
      writeJson(path.join(aiDir, 'multi-agent.policy.json'), multiAgentPolicy)],
    [path.join(aiDir, 'ANALYSIS.md'), () => writeText(path.join(aiDir, 'ANALYSIS.md'), analysisReport)],
  ];

  const outOfSync = [];
  for (const [filePath, action] of files) {
    const ok = await action();
    if (!ok) {
      outOfSync.push(path.relative(rootDir, filePath));
    }
  }

  if (checkOnly && outOfSync.length > 0) {
    console.error('[setup-ai-stack] out of sync files:');
    outOfSync.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }

  if (!checkOnly) {
    await execFileAsync('node', [syncScript], { cwd: rootDir });
    console.log('[setup-ai-stack] generated .claude/ai policy files and synced to .codex');
  } else {
    console.log('[setup-ai-stack] policy files are up to date');
  }
}

run().catch((error) => {
  console.error('[setup-ai-stack] failed:', error.message);
  process.exit(1);
});
