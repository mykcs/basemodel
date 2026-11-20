import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { evidenceSnapshotSchema, type EvidenceSnapshot } from '../src/lib/researchEvidenceSchema';

/** Local approved publication files only. No fetch, credentials or server filesystem access. */
export function verifyResearchEvidenceFiles(root: string, snapshots: readonly EvidenceSnapshot[]): string[] {
  const errors: string[] = [];
  const checked = new Map<string, string>();
  const allowed = path.resolve(root, 'public/research/seed-openevo/evidence');
  for (const value of snapshots) {
    const snapshot = evidenceSnapshotSchema.parse(value);
    if (!snapshot.publication.approved) continue; // quarantine is not a publication obligation
    const { source } = snapshot;
    const local = path.resolve(root, source.path);
    if (source.repository !== 'mykcs/basemodel' || !local.startsWith(`${allowed}${path.sep}`)) {
      errors.push(`${snapshot.id}: not a local publication artifact`);
      continue;
    }
    if (checked.has(local)) {
      if (checked.get(local) !== source.sha256) errors.push(`${snapshot.id}: conflicting source digests`);
      continue;
    }
    checked.set(local, source.sha256!);
    try {
      const actual = fs.realpathSync(local);
      if (!actual.startsWith(`${fs.realpathSync(allowed)}${path.sep}`)) throw new Error('source escapes publication directory');
      if (fs.statSync(actual).size > 2 * 1024 * 1024) throw new Error('source exceeds 2 MiB scalar-snapshot limit');
      const digest = createHash('sha256').update(fs.readFileSync(actual)).digest('hex');
      if (digest !== source.sha256) errors.push(`${snapshot.id}: source SHA-256 mismatch`);
    } catch (error) {
      errors.push(`${snapshot.id}: ${error instanceof Error ? error.message : 'source verification failed'}`);
    }
  }
  return errors;
}
