import { writeFileSync } from 'node:fs';
import type { TestInfo } from '@playwright/test';

/** Persist JSON into the uploaded results tree, not only the HTML attachment store. */
export async function persistJsonAttachment(info: TestInfo, name: string, options: NonNullable<Parameters<TestInfo['attach']>[1]>) {
  if (options.body === undefined) { await info.attach(name, options); return; }
  const data: unknown = JSON.parse(options.body.toString());
  const identity = { sha: process.env.CI_HEAD_SHA ?? process.env.GITHUB_SHA ?? 'local-dirty', engine: info.project.name, test: info.title };
  const receipt = data && typeof data === 'object' && !Array.isArray(data) ? { ...data, ...identity } : { data, ...identity };
  const path = info.outputPath(name);
  writeFileSync(path, JSON.stringify(receipt, null, 2));
  await info.attach(name, { path, contentType: options.contentType ?? 'application/json' });
}
