import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { SD_LORA_BOUNDED_RECURRENCE_SOURCE } from '../data/sdLoraVrLineages';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const overview = read('../components/research/OpenEvoSdLoraHistorySkeleton.astro');
const context = read('../components/research/OpenEvoSdLoraAccelerationContext.astro');

describe('SD-LoRA conversation publication', () => {
  it('mounts the complete context only from the canonical overview owner', () => {
    expect(overview).toContain('OpenEvoSdLoraAccelerationContext');
    expect(context).toContain('一个越来越慢的更新，后来变成两条不同研究路线');
  });

  it('keeps the two acceleration estimands separate', () => {
    expect(context).toContain('不能拼成一条“2× 继续优化到 37×”的曲线');
    expect(context).toContain('SD-LoRA v2 · Stable Reduction');
    expect(context).toContain('SD-LoRA · Bounded Online Recurrence');
  });

  it('records the naming correction without merging treatment identities', () => {
    expect(context).toContain('共享父级改成中性的“SD-LoRA 加速”');
    expect(context).toContain('VR 可以帮助在历史讨论里找到工程加速线，但不是正式实验名称');
  });

  it('preserves the prospective rank-selection path instead of showing only the final PASS', () => {
    expect(context).toContain('Fast-SD-LoRA 在封存的 128 题历史开发面板通过“功能表现不劣于”的检查');
    expect(context).toContain('rank32 单点能过，但纵向到第155轮失败');
    expect(context).toContain('rank64 在第155轮也能过，但完整纵向在第149轮失败');
    expect(context).toContain('rank128 才通过完整四点纵向资格');
    expect(context).toContain('Q0 在第149轮(rank128) → 第150轮(rank128)');
    expect(context).toContain('随后 Q1 才执行第151轮到第159轮');
  });

  it('preserves the bounded recurrence final provenance', () => {
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalAdapterSha256).toBe('2b65b71a4c822c8b2a6d4639d31a3289dc2267f9de8f0109c8c69bdd1821ad32');
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalCloseoutSha256).toBe('0a4be2489779712886b8c0557d4ca74d6000b2dc1d6b727dd56c355ed182cd79');
    expect(context).toContain('最终保护测试集访问次数为 0');
  });

  it('keeps historical admission and current recurrent writing as a third problem', () => {
    expect(context).toContain('44 个 SD-LoRA 候选更新，其中只有 7 个真正成为后续模型状态的一部分');
    expect(context).toContain('四轮配对资格实验已经全部封存，每臂 512 次任务尝试');
    expect(context).toContain('173 / 512 对 248 / 512');
  });
});

describe('sealed three-way publication plot reading styles',()=>{
  const originals={
  "task-score.svg": "cce099686fbd82fd824897623134a44742b7d92c531da65f3fa0b4752740872d",
  "task-score-20-round-mean.svg": "5cdca33d952f40260c1a44dc3f556893e8783b99702768fbcb956bbe681c4ff3",
  "loss-vs-rollout.svg": "4800681cc88d925f694549c1444cb46580655c16c1ce8a5df78355499f1cebba",
  "task-vector-frobenius.svg": "6164fa34e237f09b835dab3a9c6aefe7bd662a23f25c6d444a1691e501d6e68d",
  "tokens-per-step.svg": "6b60d9422914ff67d71c3451342f4dc8f7ac4d2df75b605766e09b48c5607532",
  "steps-per-episode.svg": "b3efa6fa05aca98735ce040128eba89828697ba6b936d96ce1b8f4ab43ff95b4",
  "action-family-entropy.svg": "7a3ab24aa17e937498ccc248f24cc201fa302d015a50ebc2a3bb363e26ff70cc"
};
  const undo=(source:string)=>source
    .replaceAll('stroke="#2563EB" stroke-dasharray="12 6"','stroke="#60A5FA"')
    .replaceAll('stroke="#B91C1C" stroke-dasharray="3 5"','stroke="#F87171"')
    .replaceAll('fill="#2563EB"','fill="#60A5FA"')
    .replaceAll('fill="#B91C1C"','fill="#F87171"');
  const accept=(source:string)=>{
    expect((source.match(/stroke="#2563EB" stroke-dasharray="12 6"/g)??[]).length).toBeGreaterThanOrEqual(2);
    expect((source.match(/stroke="#B91C1C" stroke-dasharray="3 5"/g)??[]).length).toBeGreaterThanOrEqual(2);
    expect(source).toContain('stroke="#6B7280"');
  };
  for(const [name,sha] of Object.entries(originals)){
    it(name+' preserves every original geometry/data/font byte and differentiates curve plus legend without color',()=>{
      const source=read('../../public/research/seed-openevo/evidence/wandb-threeway/'+name);
      accept(source);
      expect(createHash('sha256').update(undo(source)).digest('hex')).toBe(sha);
      expect(()=>accept(undo(source))).toThrow();
    });
  }
  it('keeps the publication receipt hashes bound to the styled reading assets',()=>{
    const receipt=JSON.parse(read('../../public/research/seed-openevo/evidence/wandb-threeway/receipt.json'));
    for(const key of ['task_score_160_round_preview','task_vector_frobenius_preview']){
      const item=receipt.derived_artifacts[key];
      expect(createHash('sha256').update(read('../../public'+item.path)).digest('hex')).toBe(item.sha256);
    }
  });
});
