// Behavior tests execute domain logic or state transitions. All other Vitest
// files are structural contract tests and are selected by the complementary
// structural config. Keep this list explicit so ownership changes are reviewed.
export const behaviorTestFiles = [
  'src/components/workspace/task/HardwareCalculator.test.ts',
  'src/lib/browserStateNormalization.test.ts',
  'src/lib/cloudflareDeploymentEnv.test.ts',
  'src/lib/evidence/buildClaimViews.test.ts',
  'src/lib/researchEngine.test.ts',
  'src/lib/researchEvidence.test.ts',
  'src/lib/researchTaskCodec.test.ts',
] as const;
