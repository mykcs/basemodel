import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { SITE_READER_CONTRACTS, readerContractForRoute } from '../src/data/siteReaderContracts';
import { buildRouteCoverage, verifyDeclaredRouteOutputs, type ResolvedPage } from './site-acceptance-core';
import { outputManifestDigest, emittedFile, fileInventory, materialInputIdentity, pageSourceInventory } from './site-acceptance-files';

/** Build-only census; never changes route HTML or replaces CI/provider acceptance. */
export default function siteAcceptance(): AstroIntegration {
  let root = '';
  let routes: ResolvedPage[] = [];
  let internalRuntimeOnly: string[] = [];
  let before: ReturnType<typeof materialInputIdentity> | null = null;
  const reportFile = () => path.join(root, 'reports/site-acceptance/coverage.json');
  return {
    name: 'basemodel-site-acceptance',
    hooks: {
      'astro:config:done': ({ config }) => { root = fileURLToPath(config.root); },
      'astro:routes:resolved': ({ routes: resolved }) => {
        internalRuntimeOnly = resolved.filter((route) => route.origin === 'internal' && !route.isPrerendered).map((route) => route.pattern);
        routes = resolved.filter((route) => !(route.origin === 'internal' && !route.isPrerendered)).map((route) => ({
          source: path.isAbsolute(route.entrypoint) ? path.relative(root, route.entrypoint) : route.entrypoint,
          pattern: route.pattern, regex: route.patternRegex, type: route.type,
        }));
      },
      'astro:build:start': () => {
        if (fs.existsSync(reportFile())) fs.unlinkSync(reportFile());
        before = materialInputIdentity(root);
      },
      'astro:build:done': ({ dir, pages, assets, logger }) => {
        const output = fileURLToPath(dir);
        const manifest = fileInventory(output).map((file) => emittedFile(output, file));
        const outputs = manifest.filter((file) => file.file.endsWith('.html') || routes.some((route) => {
          route.regex.lastIndex = 0;
          return route.type === 'endpoint' && route.regex.test(file.pathname);
        }));
        const coverage = buildRouteCoverage(outputs, routes, SITE_READER_CONTRACTS, readerContractForRoute, pages.map((page) => page.pathname));
        const compilerFiles = [...assets.values()].flat().map((url) => path.relative(output, fileURLToPath(url)).split(path.sep).join('/'));
        coverage.errors.push(...verifyDeclaredRouteOutputs(compilerFiles, outputs.map((file) => file.file)));
        const after = materialInputIdentity(root);
        if (!before || before.sha256 !== after.sha256) throw new Error('Source changed during acceptance build');
        const gitValue = (args: string[]) => {
          try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
          catch { return null; }
        };
        const report = {
          schema: 'basemodel.site-coverage.v1', materialInputs: after, internalRuntimeOnly, sourceInventory: pageSourceInventory(root),
          sourceHead: gitValue(['rev-parse', 'HEAD']),
          buildTreeClean: gitValue(['status', '--porcelain', '--untracked-files=normal']) === '',
          emittedManifestSha256: outputManifestDigest(manifest), manifest,
          ...coverage, scope: 'Generated-route ownership only; this is not integrated product acceptance.',
        };
        if (coverage.errors.length) throw new Error(`Site coverage failed:\n${coverage.errors.join('\n')}`);
        fs.mkdirSync(path.dirname(reportFile()), { recursive: true });
        fs.writeFileSync(`${reportFile()}.tmp`, `${JSON.stringify(report, null, 2)}\n`);
        fs.renameSync(`${reportFile()}.tmp`, reportFile());
        logger.info(`Site coverage: ${JSON.stringify(coverage.counts)}; human evaluation pending.`);
      },
    },
  };
}
