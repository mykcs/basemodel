export const aiGalaxySeedSnapshot = {
  checkedAtIso: '2026-08-10T14:54:00+08:00',
  checkedAtZh: '2026-08-10 14:54（UTC+8）',
  checkedAtEn: '2026-08-10 14:54 (UTC+8)',
  evidenceBoundary: {
    zh: '这是智星云公开官网与企业算力页在核验时间点展示的公开产品，不等于登录后的实时库存锁定。若算力市场显示“机器已满”，官方文档允许预约。',
    en: 'This snapshot records products publicly listed on AI Galaxy official pages at the checked time; it is not a guarantee of live post-login inventory. If the marketplace shows a machine as full, the official guide supports reservation.',
  },
  paperTarget: {
    gpu: 'NVIDIA A800 80G',
    count: 8,
    listedPublicly: false,
    sourceUrl: 'https://arxiv.org/html/2607.14777v1',
  },
  hourly: [
    { gpu: 'NVIDIA A100 80G', vramGb: 80, cnyPerHour: 8.0 },
    { gpu: 'Tesla V100 32G', vramGb: 32, cnyPerHour: 1.32 },
    { gpu: 'RTX A5000 24G', vramGb: 24, cnyPerHour: 1.62 },
    { gpu: 'RTX A6000 48G', vramGb: 48, cnyPerHour: 2.4 },
    { gpu: 'NVIDIA A40 48G', vramGb: 48, cnyPerHour: 2.2 },
    { gpu: 'RTX 4090 24G', vramGb: 24, cnyPerHour: 1.65 },
    { gpu: 'RTX 3090 24G', vramGb: 24, cnyPerHour: 1.1 },
  ],
  bareMetal: [
    { gpu: 'A100 80G NVLINK', count: 8, vramGb: 80, cnyPerMonth: 30000, memoryGb: 1024, network: '25G Ethernet; high-speed NIC configurable' },
    { gpu: 'RTX 4090 24G', count: 8, vramGb: 24, cnyPerMonth: 7500, memoryGb: 512, network: '25G Ethernet; no high-speed NIC listed' },
    { gpu: 'RTX 3090 24G', count: 8, vramGb: 24, cnyPerMonth: 5600, memoryGb: 256, network: '25G Ethernet; no high-speed NIC listed' },
    { gpu: 'A100 40G', count: 8, vramGb: 40, cnyPerMonth: 13500, memoryGb: 512, network: '25G Ethernet; no high-speed NIC listed' },
  ],
  recommendations: {
    environment: {
      sku: 'RTX 4090 24G · 1 GPU',
      price: '¥1.65/小时（公开标价）',
      zh: '只做 ALFWorld / WebShop 环境启动、Qwen2.5-3B 单条 rollout 和日志检查时，先选它。Qwen2.5-3B-Instruct 官方权重约 6.18GB、3.09B 参数，24GB 显存足以给推理型 smoke test 留出合理余量；但不要把这张卡用于声称论文级 RL 复现。',
      en: 'Use this first for ALFWorld / WebShop bring-up, a single Qwen2.5-3B rollout, and log inspection. The official Qwen2.5-3B-Instruct repository is about 6.18GB with 3.09B parameters, so 24GB is a sensible inference smoke-test tier; it is not a paper-scale RL reproduction tier.',
    },
    reducedTraining: {
      sku: 'NVIDIA A100 80G · 1 GPU',
      price: '¥8.0/小时（公开标价）',
      zh: '要开始验证 SFT → GRPO / SEED 的端到端训练链时，优先选它而不是 4090。原因不是“它更高级”，而是 80GB 显存更能容纳训练权重、优化器状态、rollout / vLLM 等同时存在的内存压力，减少为了省显存而改动实验结构。仍然要缩小 batch / rollout，并明确标注为方法验证。',
      en: 'For an end-to-end SFT → GRPO / SEED training check, prefer this over a 4090. The reason is not prestige: 80GB gives materially more room for trainable weights, optimizer state, rollout serving, and related memory pressure, reducing the need to distort the experiment just to fit. Keep reduced batches/rollouts and label the run as a method check.',
    },
    paperScaleSubstitute: {
      sku: 'A100 80G NVLINK ×8 裸金属',
      price: '¥30,000/月（公开标价）',
      zh: '这是当前智星云公开配置里最接近论文 8×A800 80G 的选择：保留 8 卡、80GB/卡、Ampere 代际与 NVLink 多卡互联。它比 8×4090 24G、8×3090 24G 或 8×A100 40G 更少改变训练条件。但 A100 不是 A800，因此结果应写成“论文规模、硬件替代的方法复现”，不能写成严格硬件复现。',
      en: 'This is the closest publicly listed AI Galaxy option to the paper’s 8×A800 80G: it preserves eight GPUs, 80GB per GPU, the Ampere generation, and NVLink multi-GPU interconnect. It changes fewer training conditions than 8×4090 24G, 8×3090 24G, or 8×A100 40G. A100 is still not A800, so label the result as a paper-scale, hardware-substituted method reproduction—not an exact hardware reproduction.',
    },
    strict: {
      sku: '当前公开目录：没有可直接选择的严格匹配项',
      price: '—',
      zh: '如果你的目标真的是“硬件也严格复现”，不要在智星云现有公开 SKU 里硬选一个。先向平台预约/售前明确询问“8×NVIDIA A800 80G，要求八卡训练拓扑与互联信息”；如果平台无法提供，就更换能明确提供该配置的算力供应商。换供应商比偷偷把 A800 改成 A100 更符合复现原则。',
      en: 'If the goal truly includes exact hardware reproduction, do not force a choice from the current public catalog. Ask AI Galaxy reservation/sales specifically for “8×NVIDIA A800 80G” plus the eight-GPU topology/interconnect details. If they cannot supply it, switch to a provider that can. Switching providers is more faithful to reproduction than silently replacing A800 with A100.',
    },
  },
  sources: {
    hourly: 'https://www.ai-galaxy.cn/',
    enterprise: 'https://ai-galaxy.cn/toB',
    rentalGuide: 'https://gpu.ai-galaxy.com/docs_v2/',
    qwen: 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct',
    nvidiaA100: 'https://www.nvidia.com/en-us/data-center/a100/',
  },
} as const;
