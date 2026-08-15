import type { Locale } from '../i18n';

export type LocalizedChangeEventNote = {
  eventType: string;
  note?: string;
  note_zh?: string;
  note_en?: string;
};

export function localizedChangeEventNote(event: LocalizedChangeEventNote, locale: Locale): string {
  if (locale === 'zh') return event.note_zh ?? event.note_en ?? event.note ?? event.eventType;
  return event.note_en ?? event.note_zh ?? event.note ?? event.eventType;
}
