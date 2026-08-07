import { useEffect, useMemo, useRef, useState } from 'react';
import { localePath, type Locale } from '../../i18n';
import type { Messages } from '../../i18n/zh';

type SearchType = 'model' | 'paper' | 'family' | 'guide';

interface SearchItem {
  type: SearchType;
  id: string;
  title: string;
  subtitle?: string;
  aliases?: string[];
  category?: string[];
  path?: string;
}

function itemHref(item: SearchItem, locale: Locale): string {
  if (item.path) return localePath(locale, item.path);
  if (item.type === 'model') return localePath(locale, `/models/${item.id}/`);
  if (item.type === 'paper') return localePath(locale, `/papers/${item.id}/`);
  return localePath(locale, '/families/');
}

export function CommandMenu({ locale, m }: { locale: Locale; m: Messages }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = () => {
    dialog.current?.showModal();
    setQuery('');
    setActiveIndex(0);
    window.setTimeout(() => input.current?.focus(), 0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (loaded) return;
    fetch(localePath(locale, '/search-index.json'))
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('search index unavailable')))
      .then((data: SearchItem[]) => { setItems(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [locale, loaded]);

  const needle = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!needle) return [];
    return items.filter((item) => [item.title, item.subtitle, ...(item.aliases ?? []), ...(item.category ?? [])]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(needle))).slice(0, 12);
  }, [items, needle]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(results.length - 1, 0)));
  }, [results.length]);

  const close = () => dialog.current?.close();
  const typeLabel = (type: SearchType) => ({ model: m.nav.searchModel, paper: m.nav.searchPaper, family: m.nav.searchFamily, guide: m.nav.searchGuide }[type]);

  return <>
    <button type="button" className="command-search-trigger" onClick={open} aria-label={m.nav.search}>
      {m.nav.search}<kbd>⌘ K</kbd>
    </button>
    <dialog
      ref={dialog}
      className="command-menu"
      aria-labelledby="command-menu-title"
      onCancel={(event) => { event.preventDefault(); close(); }}
    >
      <div className="command-menu-inner">
        <div className="command-menu-heading">
          <h2 id="command-menu-title">{m.nav.searchTitle}</h2>
          <button type="button" className="icon-button" onClick={close} aria-label={m.nav.closeSearch}>×</button>
        </div>
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => results.length ? (index + 1) % results.length : 0); }
            if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => results.length ? (index - 1 + results.length) % results.length : 0); }
            if (event.key === 'Enter' && results[activeIndex]) { event.preventDefault(); window.location.href = itemHref(results[activeIndex], locale); }
            if (event.key === 'Escape') close();
          }}
          placeholder={m.nav.searchPlaceholder}
          aria-label={m.nav.searchPlaceholder}
          aria-controls="command-results"
          aria-activedescendant={results[activeIndex] ? `search-result-${results[activeIndex].type}-${results[activeIndex].id}` : undefined}
        />
        {needle && <div id="command-results" className="command-results" role="listbox" aria-label={m.nav.searchTitle}>
          {results.map((item, index) => <a
            key={`${item.type}-${item.id}`}
            id={`search-result-${item.type}-${item.id}`}
            href={itemHref(item, locale)}
            role="option"
            aria-selected={index === activeIndex}
            className={index === activeIndex ? 'is-active' : undefined}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={close}
          >
            <strong>{item.title}</strong>
            <small>{typeLabel(item.type)}{item.subtitle ? ` · ${item.subtitle}` : ''}</small>
          </a>)}
          {!results.length && <p className="muted">{m.nav.noSearchResults}</p>}
        </div>}
        <p className="command-hint muted">{m.nav.commandHint}</p>
      </div>
    </dialog>
  </>;
}
