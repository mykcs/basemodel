import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const mergeClasses = extendTailwindMerge({
  prefix: 'tw',
  extend: { theme: { text: ['control'], 'font-weight': ['label'] } },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs));
}
