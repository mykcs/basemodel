import { getMessages, type Locale } from '../i18n';

// 存储枚举只在数据层使用；所有可见枚举都经过这里的 locale formatter。

export function displayUnknown(value: unknown, suffix = '', locale?: Locale): string {
  const m = getMessages(locale);
  if (value === null || value === undefined || value === 'unknown') return m.format.unknown;
  if (typeof value === 'boolean') return value ? m.format.yes : m.format.no;
  return `${value}${suffix}`;
}

export function displayBoolean(value: boolean | 'unknown', locale?: Locale): string {
  const m = getMessages(locale);
  return value === 'unknown' ? m.format.unknown : value ? m.format.yes : m.format.no;
}

export function statusLabel(status: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format.status as Record<string, string>)[status] ?? m.format.unknown;
}

export function tierLabel(tier: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format.tier as Record<string, string>)[tier] ?? m.format.unknown;
}

function mappedLabel(group: 'lifecycle' | 'sourceType' | 'architecture' | 'checkpoint' | 'specialization' | 'role' | 'category' | 'evolutionTarget', value: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format[group] as Record<string, string>)[value] ?? m.format.unknown;
}

export const lifecycleLabel = (value: string, locale?: Locale) => mappedLabel('lifecycle', value, locale);
export const sourceTypeLabel = (value: string, locale?: Locale) => mappedLabel('sourceType', value, locale);
export const architectureLabel = (value: string, locale?: Locale) => mappedLabel('architecture', value, locale);
export const checkpointLabel = (value: string, locale?: Locale) => mappedLabel('checkpoint', value, locale);
export const specializationLabel = (value: string, locale?: Locale) => mappedLabel('specialization', value, locale);
export const roleLabel = (value: string, locale?: Locale) => mappedLabel('role', value, locale);
export const categoryLabel = (value: string, locale?: Locale) => mappedLabel('category', value, locale);
export const evolutionTargetLabel = (value: string, locale?: Locale) => mappedLabel('evolutionTarget', value, locale);
export const taskLabel = (value: string, locale?: Locale) => {
  const m = getMessages(locale);
  return (m.selector.tasks as Record<string, string>)[value] ?? m.format.unknown;
};
export const modalityLabel = (value: string, locale?: Locale) => {
  const m = getMessages(locale);
  return (m.modalities as Record<string, string>)[value] ?? m.format.unknown;
};

/** Stable comparison key for model display names (spacing and punctuation are not identity). */
export function canonicalNameKey(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^a-z0-9]+/g, '');
}

export function isSameCanonicalName(left: string | undefined, right: string | undefined): boolean {
  return Boolean(left && right) && canonicalNameKey(left!) === canonicalNameKey(right!);
}

/** Whether a display label is already part of the canonical model name. */
export function nameContainsCanonicalName(name: string | undefined, label: string | undefined): boolean {
  const nameKey = canonicalNameKey(name ?? '');
  const labelKey = canonicalNameKey(label ?? '');
  return Boolean(nameKey && labelKey) && nameKey.includes(labelKey);
}

/**
 * Return only model-context labels that add information next to the model name.
 * Family/generation values embedded in the name (or in a more specific sibling)
 * are omitted so a detail header does not repeat the same identity three times.
 */
export function modelContextLabels(model: { name: string; family: string; generation: string }): string[] {
  const candidates = [model.family, model.generation];
  const familyInName = nameContainsCanonicalName(model.name, model.family);
  return candidates.filter((value, index) => {
    if (nameContainsCanonicalName(model.name, value)) return false;
    // A generation such as "Qwen 1" or "Vicuna v1" adds no new context when
    // the family is already part of the model name; keep the title as the
    // single identity source in that case.
    if (index === 1 && familyInName && nameContainsCanonicalName(value, model.family)) return false;
    return !candidates.some((other, otherIndex) => otherIndex !== index && nameContainsCanonicalName(other, value));
  });
}

/** Labels suitable for the small context line immediately above a model title. */
export function modelIdentityTrail(model: { name: string; vendor: string; family: string; generation: string }): string[] {
  // Vendor strings occasionally include the family (for example
  // "Alibaba / Qwen" or "LMSYS / Vicuna"). Keep only the non-redundant
  // provider part so the eyebrow does not reintroduce the family we removed.
  const vendor = model.vendor.split('/').map((part) => part.trim()).filter((part) => part && !nameContainsCanonicalName(part, model.family)).join(' / ');
  return [vendor, ...modelContextLabels(model)].filter(Boolean);
}

const zhRelationNotes: Record<string, string> = {
  'text-davinci-003 is the AdaPlanner adaptive planning backbone.': 'text-davinci-003 作为 AdaPlanner 的自适应规划骨干。',
  'GPT-4 benchmarked as an AgentBench agent.': 'GPT-4 作为 AgentBench 智能体参与基准测试。',
  'GPT-3.5 Turbo benchmarked as an AgentBench agent.': 'GPT-3.5 Turbo 作为 AgentBench 智能体参与基准测试。',
  'Llama-2-70B-Chat benchmarked as an open AgentBench agent.': 'Llama-2-70B-Chat 作为开放权重 AgentBench 智能体参与基准测试。',
  'Vicuna-13B benchmarked as an open AgentBench agent.': 'Vicuna-13B 作为开放权重 AgentBench 智能体参与基准测试。',
  'GPT-4 benchmarked on AgentBoard.': 'GPT-4 在 AgentBoard 上参与基准测试。',
  'GPT-3.5 Turbo benchmarked on AgentBoard.': 'GPT-3.5 Turbo 在 AgentBoard 上参与基准测试。',
  'Llama-2-70B-Chat benchmarked on AgentBoard.': 'Llama-2-70B-Chat 在 AgentBoard 上参与基准测试。',
  'Qwen-7B-Chat benchmarked on AgentBoard.': 'Qwen-7B-Chat 在 AgentBoard 上参与基准测试。',
  'GPT-3.5 Turbo acts as multi-agent collaboration policy.': 'GPT-3.5 Turbo 作为多智能体协作策略。',
  'GPT-4 used for higher-capability agent roles / evaluation.': 'GPT-4 用于更高能力的智能体角色与评估。',
  'GPT-4o evaluated as an AppWorld agent backbone.': 'GPT-4o 作为 AppWorld 智能体骨干接受评估。',
  'GPT-4 benchmarked on AppWorld.': 'GPT-4 在 AppWorld 上参与基准测试。',
  'Claude 3.5 Sonnet benchmarked on AppWorld.': 'Claude 3.5 Sonnet 在 AppWorld 上参与基准测试。',
  'GPT-3.5 Turbo plays both role-playing agents (user and assistant) in CAMEL.': 'GPT-3.5 Turbo 在 CAMEL 中同时扮演用户与助手两个角色智能体。',
  'GPT-4 as Chameleon planner composing tool sequences.': 'GPT-4 作为 Chameleon 规划器编排工具序列。',
  'GPT-3.5 Turbo used in Chameleon ablations / tool execution.': 'GPT-3.5 Turbo 用于 Chameleon 消融实验与工具执行。',
  'GPT-3.5 Turbo as initial generator corrected via tool-interactive critique.': 'GPT-3.5 Turbo 作为初始生成器，通过工具交互式批评进行纠正。',
  'text-davinci-003 evaluated as a CRITIC backbone.': 'text-davinci-003 作为 CRITIC 骨干接受评估。',
  'Llama-2-70B-Chat evaluated as open-source CRITIC backbone.': 'Llama-2-70B-Chat 作为开源 CRITIC 骨干接受评估。',
  'GPT-3.5 Turbo as a target LM whose prompts are compiled by DSPy.': 'GPT-3.5 Turbo 作为目标语言模型，其提示词由 DSPy 编译。',
  'Llama-2-13B-Chat used as open-source LM in DSPy pipelines.': 'Llama-2-13B-Chat 作为开源语言模型用于 DSPy 流水线。',
  'GPT-4 as the ExpeL agent policy extracting experiential insights.': 'GPT-4 作为 ExpeL 智能体策略提取经验洞见。',
  'GPT-3.5 Turbo used in experience-collection / reflection ablations.': 'GPT-3.5 Turbo 用于经验收集与反思消融实验。',
  "GPT-3.5 Turbo powers the simulated agents' planning, reflection and dialogue.": 'GPT-3.5 Turbo 驱动模拟智能体的规划、反思与对话。',
  'GPT-4 drives the role-specialized agents in the MetaGPT SOP framework.': 'GPT-4 驱动 MetaGPT 流程框架中的角色专门化智能体。',
  'GPT-4o evaluated as an OpenHands agent backbone.': 'GPT-4o 作为 OpenHands 智能体骨干接受评估。',
  'Claude 3.5 Sonnet evaluated as an OpenHands agent backbone.': 'Claude 3.5 Sonnet 作为 OpenHands 智能体骨干接受评估。',
  'GPT-4 evaluated as an OSWorld computer-use agent.': 'GPT-4 作为 OSWorld 计算机操作智能体接受评估。',
  'GPT-4V evaluated as a multimodal OSWorld agent.': 'GPT-4V 作为多模态 OSWorld 智能体接受评估。',
  'Claude 3 Opus benchmarked on OSWorld.': 'Claude 3 Opus 在 OSWorld 上参与基准测试。',
  'Gemini 1.5 Pro benchmarked on OSWorld.': 'Gemini 1.5 Pro 在 OSWorld 上参与基准测试。',
  'GPT-4 drives the Reflexion agent policy and verbal self-reflection, no weights updated.': 'GPT-4 驱动 Reflexion 智能体策略与语言反思，未更新权重。',
  'GPT-3.5 Turbo used as a base generator in Self-Refine experiments.': 'GPT-3.5 Turbo 作为基础生成器用于 Self-Refine 实验。',
  'GPT-4 provides feedback-and-refine loop for self-improvement.': 'GPT-4 为自我改进提供反馈与精炼循环。',
  'GPT-4 is the SWE-agent policy for repository-level issue resolution.': 'GPT-4 是 SWE-agent 用于仓库级问题解决的策略。',
  'Claude 2 benchmarked on SWE-bench.': 'Claude 2 在 SWE-bench 上参与基准测试。',
  'GPT-4 benchmarked on SWE-bench.': 'GPT-4 在 SWE-bench 上参与基准测试。',
  'GPT-3.5 Turbo benchmarked on SWE-bench.': 'GPT-3.5 Turbo 在 SWE-bench 上参与基准测试。',
  'GPT-4 is the Voyager policy for code-generation and self-critique in Minecraft.': 'GPT-4 是 Voyager 在 Minecraft 中用于代码生成与自我批评的策略。',
  'GPT-4 benchmarked as a WebArena agent.': 'GPT-4 作为 WebArena 智能体参与基准测试。',
  'GPT-3.5 Turbo benchmarked as a WebArena agent.': 'GPT-3.5 Turbo 作为 WebArena 智能体参与基准测试。',
  'text-davinci-003 benchmarked as a WebArena agent.': 'text-davinci-003 作为 WebArena 智能体参与基准测试。',
  'Llama-2-70B-Chat benchmarked as an open-source WebArena agent.': 'Llama-2-70B-Chat 作为开源 WebArena 智能体参与基准测试。',
};

export function noteLabel(note: string | undefined, locale?: Locale): string {
  if (!note) return '';
  if (locale === 'en') return note;
  const normalized = note.trim().replace(/\s+/g, ' ');
  return zhRelationNotes[normalized] ?? getMessages(locale).format.unknown;
}

export function parameterSummary(total: unknown, active: unknown, type: string, locale?: Locale): string {
  if (type === 'moe') {
    const totalText = displayUnknown(total, 'B', locale);
    const activeText = displayUnknown(active, 'B', locale);
    return locale === 'en' ? `${totalText} total / ${activeText} active` : `${totalText} 总计 / ${activeText} 激活`;
  }
  const value = displayUnknown(total, 'B', locale);
  return locale === 'en' ? `${value} parameters` : `${value} 参数`;
}
