import { spawn, spawnSync } from 'node:child_process';

const port = process.argv[2] ?? '4327';
const origin = `http://127.0.0.1:${port}`;
const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', port], {
  stdio: 'inherit',
  env: process.env,
});

let stopped = false;
const stopPreview = () => {
  if (stopped) return;
  stopped = true;
  spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'inherit', env: process.env });
};

const fail = (error) => {
  stopPreview();
  preview.kill('SIGTERM');
  throw error;
};

for (let attempt = 0; attempt < 300; attempt += 1) {
  try {
    const response = await fetch(`${origin}/`);
    if (response.ok) break;
  } catch {
    // Astro preview starts as a managed background process; keep polling.
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (attempt === 299) fail(new Error(`Timed out waiting for Astro preview at ${origin}`));
}

process.on('SIGINT', () => {
  stopPreview();
  process.exit(130);
});
process.on('SIGTERM', () => {
  stopPreview();
  process.exit(143);
});
process.on('exit', stopPreview);

setInterval(() => {}, 2 ** 30);
