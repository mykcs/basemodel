import { useState } from 'react';
import { copyTextToClipboard } from '../../lib/clipboard';

interface Props {
  value: string;
  label: string;
  copiedLabel: string;
  failedLabel?: string;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
  onCopied?: () => void;
}

export function CopyButton({ value, label, copiedLabel, failedLabel, className = '', compact = false, disabled = false, onCopied }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    if (disabled) return;
    const ok = await copyTextToClipboard(value);
    setState(ok ? 'copied' : 'failed');
    if (ok) onCopied?.();
    window.setTimeout(() => setState('idle'), 1600);
  };
  const text = state === 'copied' ? copiedLabel : state === 'failed' ? (failedLabel ?? label) : label;
  return <button
    type="button"
    className={`button button-secondary actionable-result-copy ${compact ? 'is-compact' : ''} ${className}`.trim()}
    onClick={copy}
    disabled={disabled}
    data-copy-state={state}
    aria-live="polite"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
    <span>{text}</span>
  </button>;
}
