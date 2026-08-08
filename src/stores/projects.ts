import { persistentAtom } from '@nanostores/persistent';
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

export const researchProjects = persistentAtom<ResearchProject[]>('atlas-research-projects', [], {
  encode: (value) => JSON.stringify(value.slice(0, MAX_PROJECTS)),
  decode: (value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.filter((item): item is ResearchProject => Boolean(item && typeof item === 'object' && 'id' in item && 'task' in item)).slice(0, MAX_PROJECTS) : [];
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
    task,
    candidateIds: [...new Set(candidateIds)].slice(0, 12),
    compareIds: [...new Set(compareIds)].slice(0, 5),
  };
  researchProjects.set([project, ...current.filter((item) => item.id !== project.id)].slice(0, MAX_PROJECTS));
  return project;
}

export function removeResearchProject(id: string) {
  researchProjects.set(researchProjects.get().filter((project) => project.id !== id));
}
