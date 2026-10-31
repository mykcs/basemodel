import { useEffect, useRef, useState } from 'react';
import { Check, CircleAlert, Copy } from 'lucide-react';
import { animate } from 'motion/mini';
import { copyTextToClipboard } from '../../lib/clipboard';
import { Button } from '../ui/button';

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
  const feedback = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (state === 'idle') return;
    const timeout = window.setTimeout(() => setState('idle'), 1600);
    const animation = feedback.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? animate(feedback.current, { transform: ['scale(.85)', 'scale(1)'] }, { duration: .16, ease: 'easeOut' })
      : undefined;
    return () => {
      window.clearTimeout(timeout);
      animation?.stop();
    };
  }, [state]);
  const copy = async () => {
    if (disabled) return;
    const ok = await copyTextToClipboard(value);
    setState(ok ? 'copied' : 'failed');
    if (ok) onCopied?.();
  };
  const text = state === 'copied' ? copiedLabel : state === 'failed' ? (failedLabel ?? label) : label;
  const Icon = state === 'copied' ? Check : state === 'failed' ? CircleAlert : Copy;
  return <Button
    type="button"
    variant="outline"
    size={compact ? 'sm' : 'default'}
    className={`actionable-result-copy ${className}`.trim()}
    onClick={copy}
    disabled={disabled}
    data-copy-state={state}
    aria-live="polite"
  >
    <span ref={feedback} className="tw:inline-flex" data-copy-feedback aria-hidden="true"><Icon size={14} strokeWidth={1.8} /></span>
    <span>{text}</span>
  </Button>;
}
