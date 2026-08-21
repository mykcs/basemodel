import { persistentAtom } from '@nanostores/persistent';
import { normalizeResearchTask } from '../lib/researchTaskNormalization';
import { normalizeCandidateIds } from './candidates';
import { normalizeCompareIds } from './compare';
import type { ResearchTask } from './researchTask';

export interface ResearchProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  task: ResearchTask;
  candidateIds: string[];
  compareIds: string[];
}

const MAX_PROJECTS = 12;

export function normalizeResearchProject(value: unknown): ResearchProject | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !item.id.trim()) return null;
  if (typeof item.name !== 'string' || typeof item.createdAt !== 'string' || typeof item.updatedAt !== 'string') return null;
  return {
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    task: normalizeResearchTask(item.task),
    candidateIds: normalizeCandidateIds(item.candidateIds),
    compareIds: normalizeCompareIds(item.compareIds),
  };
}

export const researchProjects = persistentAtom<ResearchProject[]>('atlas-research-projects', [], {
  encode: (value) => JSON.stringify(value.slice(0, MAX_PROJECTS)),
  decode: (value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed)
        ? parsed.flatMap((item) => {
            const project = normalizeResearchProject(item);
            return project ? [project] : [];
          }).slice(0, MAX_PROJECTS)
        : [];
    } catch {
      return [];
    }
  },
});

export function saveResearchProject(name: string, task: ResearchTask, candidateIds: string[], compareIds: string[], existingId?: string) {
  const now = new Date().toISOString();
  const current = researchProjects.get();
  const existing = existingId ? current.find((project) => project.id === existingId) : undefined;
  const project: ResearchProject = {
    id: existing?.id ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`),
    name: name.trim() || `Research project ${now.slice(0, 10)}`,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    task: normalizeResearchTask(task),
    candidateIds: normalizeCandidateIds(candidateIds),
    compareIds: normalizeCompareIds(compareIds),
  };
  researchProjects.set([project, ...current.filter((item) => item.id !== project.id)].slice(0, MAX_PROJECTS));
  return project;
}

export function removeResearchProject(id: string) {
  researchProjects.set(researchProjects.get().filter((project) => project.id !== id));
}
