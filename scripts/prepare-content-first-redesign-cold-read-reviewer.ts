import process from 'node:process';
import { prepareContentFirstReviewerWorkspace } from './content-first-redesign-cold-read-reviewer';

const args = process.argv.slice(2);
const getArg = (name: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const packetDir = getArg('packet-dir');
const outDir = getArg('out-dir');
const phase = getArg('phase') as 'blind' | 'compare' | undefined;
const phaseAResultsDir = getArg('phase-a-results-dir');
if (!packetDir || !outDir || !phase || !['blind', 'compare'].includes(phase)) {
  console.error('Usage: npm run redesign:cold-read:reviewer -- --phase=<blind|compare> --packet-dir=/tmp/packet --out-dir=/tmp/reviewer [--phase-a-results-dir=/tmp/results]');
  process.exit(2);
}
if (phase === 'compare' && !phaseAResultsDir) {
  console.error('COMPARE_REQUIRES_PHASE_A_RESULTS_DIR');
  process.exit(2);
}
try {
  const result = prepareContentFirstReviewerWorkspace({ packetDir, outDir, phase, phaseAResultsDir });
  console.log(`CONTENT_FIRST_REVIEWER_WORKSPACE=PASS phase=${result.phase} productHead=${result.productHead} cases=${result.cases} outDir=${outDir}`);
} catch (error) {
  console.error(`CONTENT_FIRST_REVIEWER_WORKSPACE=FAIL\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
