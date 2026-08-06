import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { researchTask } from '../../stores/researchTask';
import { scoreModels } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
}

function boolStr(v: boolean | string, m: Messages): string {
  if (typeof v === 'boolean') return v ? m.format.yes : m.format.no;
  return m.format.semanticStatus[v as keyof Messages['format']['semanticStatus']] ?? m.format.unknown;
}

function tierStr(v: string, m: Messages): string {
  return m.format.tier[v as keyof Messages['format']['tier']] ?? m.format.unknown;
}

/**
 * 替换分析：选一个原模型，给出同家族或同角色的现代替代候选，
 * 并排对比替换后在开放性 / 上下文 / 硬件 / 微调许可上的影响。
 */
export function SubstituteLab({ models, papers, m }: Props) {
  const task = useStore(researchTask);
  const [baseId, setBaseId] = useState<string>('');

  const base = models.find((x) => x.id === baseId) ?? null;

  const substitutes = useMemo(() => {
    if (!base) return [];
    const scored = scoreModels(models, papers, task);
    return scored
      .filter((s) => s.model.id !== base.id && s.eligible)
      .map((s) => {
        const sameFamily = s.model.vendor === base.vendor && s.model.family === base.family;
        const sameRole = task.roles.some((role) =>
          papers.some((p) => p.models.some((u) => u.model_id === s.model.id && u.role === role))
        );
        const newer = s.model.release_date > base.release_date;
        return { s, sameFamily, sameRole, newer };
      })
      .filter((x) => (x.sameFamily || x.sameRole) && x.newer)
      .sort((a, b) => b.s.score - a.s.score)
      .slice(0, 4);
  }, [base, models, papers, task]);

  return (
    <section className="substitute-lab" aria-label={m.research.substitute.title}>
      <h2>{m.research.substitute.title}</h2>

      <div className="field">
        <label htmlFor="substitute-base">{m.research.substitute.selectBase}</label>
        <select id="substitute-base" value={baseId} onChange={(e) => setBaseId(e.target.value)}>
          <option value="">—</option>
          {models.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} ({x.release_date})
            </option>
          ))}
        </select>
      </div>

      {!base ? (
        <p className="empty-state">{m.research.substitute.empty}</p>
      ) : substitutes.length === 0 ? (
        <p className="empty-state">{m.research.substitute.noSubstitute}</p>
      ) : (
        <div className="substitute-list">
          {substitutes.map(({ s }) => (
            <SubstituteCard key={s.model.id} base={base} rep={s.model} m={m} />
          ))}
        </div>
      )}
    </section>
  );
}

function SubstituteCard({ base, rep, m }: { base: AtlasModel; rep: AtlasModel; m: Messages }) {
  const rows: Array<{ label: string; a: string; b: string; changed: boolean }> = [
    {
      label: m.research.substitute.openness,
      a: boolStr(base.openness.weights_available, m),
      b: boolStr(rep.openness.weights_available, m),
      changed: base.openness.weights_available !== rep.openness.weights_available,
    },
    {
      label: m.research.substitute.context,
      a: String(base.architecture.context_length),
      b: String(rep.architecture.context_length),
      changed: base.architecture.context_length !== rep.architecture.context_length,
    },
    {
      label: m.research.substitute.hardware,
      a: tierStr(base.hardware.inference_tier, m),
      b: tierStr(rep.hardware.inference_tier, m),
      changed: base.hardware.inference_tier !== rep.hardware.inference_tier,
    },
    {
      label: m.research.substitute.finetune,
      a: boolStr(base.openness.finetuning_allowed, m),
      b: boolStr(rep.openness.finetuning_allowed, m),
      changed: base.openness.finetuning_allowed !== rep.openness.finetuning_allowed,
    },
    {
      label: m.research.substitute.release,
      a: base.release_date,
      b: rep.release_date,
      changed: true,
    },
  ];

  return (
    <div className="substitute-card">
      <h3>
        {base.name} → {rep.name}
      </h3>
      <table className="substitute-table">
        <thead>
          <tr>
            <th scope="col">{m.research.substitute.field}</th>
            <th scope="col">{m.research.substitute.original}</th>
            <th scope="col">{m.research.substitute.replacement}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={r.changed ? 'is-changed' : ''}>
              <th scope="row">{r.label}</th>
              <td>{r.a}</td>
              <td>{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
