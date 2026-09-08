const branch = process.env.WORKERS_CI_BRANCH?.trim() ?? '';
if (process.env.WORKERS_CI !== '1') {
  console.error('[ci-cloudflare-qualification] deploy no-op requires WORKERS_CI=1');
  process.exit(2);
}
if (!branch.startsWith('ci/cloudflare-workers-builds-qualification-')) {
  console.error(`[ci-cloudflare-qualification] refuse deploy command on non-qualification branch: ${branch || '<empty>'}`);
  process.exit(2);
}
console.log('[ci-cloudflare-qualification] build accepted; deploy is intentionally a no-op. No website or Worker version is published by CI qualification.');
