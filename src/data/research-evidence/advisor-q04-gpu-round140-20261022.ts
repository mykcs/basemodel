/**
 * Q04 resource-profile display receipt, read-only host inspection on 2026-10-22.
 *
 * This is a dated, sanitized PUBLIC SUMMARY of one completed Q04 cycle, not a
 * continuously sampled GPU trace or a replacement for the scientific ledger.
 * No host, account, workspace path, task text, or private raw artifact is here.
 * The experiment family is documented in mykcs/openevo-experiment PR #631;
 * this particular cycle's resource observations came from host-side phase
 * receipts and two independent NVML snapshots, not from that PR's result table.
 */
export const Q04_GPU_ROUND140 = {
  identity: 'Cell 1 · rank 128 · Round 140',
  model: 'Qwen3-1.7B',
  device: 'GeForce RTX 5090',
  nominalGpuGb: 32,
  cudaVisibleMiB: 32607,
  startEpochSeconds: 1792665862.1682012,
  endEpochSeconds: 1792667934.2929008,
  stages: [
    { key: 'rollout', label: 'Agent 做购物任务', startSeconds: 0, endSeconds: 1553.445, color: '#3486d7', explanation: '模型搜索、比较并尝试完成 WebShop 任务' },
    { key: 'prepare', label: '验收与整理数据', startSeconds: 1553.445, endSeconds: 1596.476, color: '#8b9aac', explanation: '核对任务、整理证据与训练输入，含阶段间空隙' },
    { key: 'update', label: '参数更新', startSeconds: 1596.476, endSeconds: 1649.309, color: '#e3a24d', explanation: '把本轮经验写入低秩参数' },
    { key: 'carriers', label: '文字／技能／系统尝试', startSeconds: 1649.309, endSeconds: 2072.125, color: '#9571cf', explanation: '依次尝试其他经验载体；此轮部分返回失败状态' },
  ],
  nvmlSnapshots: [
    { tSeconds: 1.832, usedMiB: 2, note: '做题开始时的 GPU 总显存快照（NVML）' },
    { tSeconds: 1543.832, usedMiB: 4586, note: '做题末尾的 GPU 总显存快照（NVML）' },
  ],
  transitionTorchPeakBytes: 6136238080,
  // Admission thresholds are conservative scheduling parameters, not peaks.
  schedulerBudget: { rolloutMiB: 12288, highPhaseMiB: 24576, headroomMiB: 4096 },
  experimentContextUrl: 'https://github.com/mykcs/openevo-experiment/pull/631',
  collectedOn: '2026-10-22',
} as const;

export const q04GpuSeconds = Q04_GPU_ROUND140.endEpochSeconds - Q04_GPU_ROUND140.startEpochSeconds;
export const q04GpuPeakGiB = Q04_GPU_ROUND140.transitionTorchPeakBytes / 2 ** 30;

// The graph must never join discrete NVML snapshots to the PyTorch peak as if
// these were simultaneous, comparable measurements of one continuous series.
export const q04GpuHasContinuousSampling = false as const;
