export type CompareImpactCode = 'generation' | 'checkpoint' | 'access' | 'license' | 'training' | 'hardware' | 'evidence';

export interface CompareImpact {
  code: CompareImpactCode;
  fieldPaths: string[];
}

export function compareImpactFor(code: CompareImpactCode): CompareImpact {
  const fieldPaths: Record<CompareImpactCode, string[]> = {
    generation: ['release_date', 'generation'],
    checkpoint: ['checkpoint.type'],
    access: ['openness.weights_available', 'access.api_status'],
    license: ['openness.license_name', 'openness.derivative_release_allowed', 'openness.commercial_use_allowed'],
    training: ['research.suitable_for_lora', 'research.suitable_for_sft', 'research.suitable_for_rl'],
    hardware: ['hardware.inference_tier', 'hardware.lora_tier', 'hardware.full_sft_tier', 'hardware.rl_tier'],
    evidence: ['data_status', 'claim_status'],
  };
  return { code, fieldPaths: fieldPaths[code] };
}
