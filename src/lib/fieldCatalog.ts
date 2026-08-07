export interface FieldCatalogEntry {
  labelZh: string;
  labelEn: string;
  impactZh: string;
  impactEn: string;
}

/** Human-facing names for the field paths used by source.supports. */
export const fieldCatalog: Record<string, FieldCatalogEntry> = {
  release_date: { labelZh: '发布日期', labelEn: 'Release date', impactZh: '影响代际与时间可比性。', impactEn: 'Affects generation and time comparability.' },
  status: { labelZh: '生命周期状态', labelEn: 'Lifecycle status', impactZh: '影响模型是否仍处于当前使用阶段。', impactEn: 'Indicates whether the model remains in active use.' },
  'architecture.type': { labelZh: '架构类型', labelEn: 'Architecture type', impactZh: '影响推理、训练和替换时的工程可比性。', impactEn: 'Affects engineering comparability for inference, training, and replacement.' },
  'architecture.total_parameters_b': { labelZh: '总参数量', labelEn: 'Total parameters', impactZh: '影响规模比较与资源判断。', impactEn: 'Affects scale comparison and resource planning.' },
  'architecture.active_parameters_b': { labelZh: '激活参数量', labelEn: 'Active parameters', impactZh: '影响 MoE 模型推理成本与规模比较。', impactEn: 'Affects MoE inference cost and scale comparison.' },
  'architecture.context_length': { labelZh: '上下文长度', labelEn: 'Context length', impactZh: '影响长上下文实验能否直接复现。', impactEn: 'Affects whether long-context experiments can be reproduced directly.' },
  'architecture.expert_count': { labelZh: '专家数量', labelEn: 'Expert count', impactZh: '影响 MoE 架构与路由规模比较。', impactEn: 'Affects MoE architecture and routing-scale comparison.' },
  'architecture.active_experts_per_token': { labelZh: '每 token 激活专家数', labelEn: 'Active experts per token', impactZh: '影响 MoE 推理成本与路由行为比较。', impactEn: 'Affects MoE inference cost and routing comparison.' },
  'checkpoint.type': { labelZh: 'Checkpoint 类型', labelEn: 'Checkpoint type', impactZh: '影响原实验与替换模型的直接可比性。', impactEn: 'Affects direct comparability with the original experiment.' },
  'openness.weights_available': { labelZh: '开放权重', labelEn: 'Open weights', impactZh: '影响本地推理与权重更新实验。', impactEn: 'Affects local inference and weight-update experiments.' },
  'openness.classification': { labelZh: '开放性分类', labelEn: 'Openness classification', impactZh: '说明模型的开放边界，不等同于开源。', impactEn: 'Describes the access boundary; it is not synonymous with open source.' },
  'openness.license_name': { labelZh: '许可证', labelEn: 'License', impactZh: '影响使用、修改与衍生分发。', impactEn: 'Affects use, modification, and derivative distribution.' },
  'openness.base_checkpoint_available': { labelZh: 'Base checkpoint', labelEn: 'Base checkpoint', impactZh: '影响从基础模型开始的训练复现。', impactEn: 'Affects training reproduction from the base model.' },
  'openness.finetuning_allowed': { labelZh: '允许微调', labelEn: 'Finetuning allowed', impactZh: '影响 LoRA、SFT 等权重更新实验。', impactEn: 'Affects LoRA, SFT, and other weight-update experiments.' },
  'openness.derivative_release_allowed': { labelZh: '允许衍生分发', labelEn: 'Derivative release allowed', impactZh: '影响实验产物能否公开分发。', impactEn: 'Affects whether experiment artifacts can be distributed.' },
  'openness.commercial_use_allowed': { labelZh: '允许商业使用', labelEn: 'Commercial use allowed', impactZh: '影响商业部署与研究成果转化。', impactEn: 'Affects commercial deployment and transfer.' },
  'access.weights_status': { labelZh: '权重获取状态', labelEn: 'Weights access status', impactZh: '影响能否本地获取并运行权重。', impactEn: 'Affects whether weights can be obtained and run locally.' },
  'access.api_status': { labelZh: 'API 状态', labelEn: 'API status', impactZh: '影响 API 推理路径与版本固定。', impactEn: 'Affects the API inference path and version pinning.' },
  'access.api_model_ids': { labelZh: 'API 模型标识', labelEn: 'API model IDs', impactZh: '影响调用时能否准确固定模型版本。', impactEn: 'Affects whether the invoked model version can be pinned.' },
  'access.product_status': { labelZh: '产品可用性', labelEn: 'Product availability', impactZh: '影响通过产品界面使用模型。', impactEn: 'Affects use through a product surface.' },
  'research.suitable_for_inference': { labelZh: '推理适配', labelEn: 'Inference suitability', impactZh: '影响模型能否承担推理角色。', impactEn: 'Affects whether the model can serve an inference role.' },
  'research.suitable_for_lora': { labelZh: 'LoRA 训练适配', labelEn: 'LoRA suitability', impactZh: '影响低成本权重更新实验。', impactEn: 'Affects low-cost weight-update experiments.' },
  'research.suitable_for_sft': { labelZh: 'SFT 训练适配', labelEn: 'SFT suitability', impactZh: '影响监督微调实验。', impactEn: 'Affects supervised fine-tuning experiments.' },
  'research.suitable_for_rl': { labelZh: 'RL 训练适配', labelEn: 'RL suitability', impactZh: '影响强化学习训练实验。', impactEn: 'Affects reinforcement-learning training experiments.' },
  'research.transformers_support': { labelZh: 'Transformers 支持', labelEn: 'Transformers support', impactZh: '影响常用本地推理与训练工具链。', impactEn: 'Affects the common local inference and training toolchain.' },
  'research.vllm_support': { labelZh: 'vLLM 支持', labelEn: 'vLLM support', impactZh: '影响高吞吐本地推理路径。', impactEn: 'Affects the high-throughput local inference path.' },
  'research.sglang_support': { labelZh: 'SGLang 支持', labelEn: 'SGLang support', impactZh: '影响结构化推理服务路径。', impactEn: 'Affects the structured inference-serving path.' },
  'research.verl_recipe_available': { labelZh: '可验证 veRL 配方', labelEn: 'Verified veRL recipe', impactZh: '影响强化学习实验的上手与复现成本。', impactEn: 'Affects the setup and reproduction cost of RL experiments.' },
  'hardware.inference_tier': { labelZh: '推理硬件档位', labelEn: 'Inference hardware tier', impactZh: '影响粗粒度资源筛选，不是精确显存计算器。', impactEn: 'Supports coarse resource filtering; it is not an exact VRAM calculator.' },
  'hardware.lora_tier': { labelZh: 'LoRA 硬件档位', labelEn: 'LoRA hardware tier', impactZh: '影响粗粒度 LoRA 资源筛选。', impactEn: 'Supports coarse LoRA resource filtering.' },
  'hardware.full_sft_tier': { labelZh: '全参数 SFT 硬件档位', labelEn: 'Full SFT hardware tier', impactZh: '影响粗粒度全参数微调资源筛选。', impactEn: 'Supports coarse full-parameter fine-tuning filtering.' },
  'hardware.rl_tier': { labelZh: 'RL 硬件档位', labelEn: 'RL hardware tier', impactZh: '影响粗粒度强化学习资源筛选。', impactEn: 'Supports coarse RL resource filtering.' },
  'reproducibility.model_revision_required': { labelZh: '模型版本固定要求', labelEn: 'Model revision requirement', impactZh: '影响实验能否固定到同一模型版本。', impactEn: 'Affects whether the experiment can pin the same model revision.' },
  'reproducibility.api_version_pinnable': { labelZh: 'API 版本可固定', labelEn: 'API revision pinnable', impactZh: '影响 API 结果的可重复性。', impactEn: 'Affects API result reproducibility.' },
  'reproducibility.tokenizer_public': { labelZh: '公开 tokenizer', labelEn: 'Public tokenizer', impactZh: '影响输入切分与训练复现。', impactEn: 'Affects tokenization and training reproduction.' },
  'reproducibility.config_public': { labelZh: '公开 config', labelEn: 'Public config', impactZh: '影响架构与推理配置复现。', impactEn: 'Affects architecture and inference-config reproduction.' },
  'reproducibility.chat_template_public': { labelZh: '公开 chat template', labelEn: 'Public chat template', impactZh: '影响对话格式与工具调用复现。', impactEn: 'Affects chat formatting and tool-use reproduction.' },
};

export function fieldLabel(fieldPath: string, locale: 'zh' | 'en' = 'zh'): string {
  const entry = fieldCatalog[fieldPath];
  return entry ? (locale === 'zh' ? entry.labelZh : entry.labelEn) : locale === 'zh' ? '字段级关联待分类' : 'Field link pending classification';
}
