import { isSpacingProperty, normalizeSpacingValue, readingWidthDecision, spacingRole } from '../../scripts/lib/sitewide-spacing.mjs';

type InlineSpacing = { element: string; selector: string; property: string; value: string };

/** Hydrated styles use exactly the same value rules as the build, including calc. */
export function inlineSpacingViolations(candidates: InlineSpacing[]) {
  return candidates.filter(({ selector, property, value }) => {
    try {
      const next = isSpacingProperty(property)
        ? normalizeSpacingValue(value, spacingRole(selector, property))
        : readingWidthDecision({ prop: property, value, parent: { selector } }, 'runtime')?.next ?? value;
      return next !== value;
    }
    catch { return true; }
  });
}

/** Runs inside the real page: token presence alone cannot satisfy these probes. */
export async function readRenderedDesign(input: string[] | { requiredTokens: string[]; staticDocument: true }) {
  const requiredTokens = Array.isArray(input) ? input : input.requiredTokens;
  const staticDocument = !Array.isArray(input) && input.staticDocument;
  const probeStarted = performance.now();
  const root = document.documentElement;
  const rootStyle = getComputedStyle(root);
  const tokens = Object.fromEntries(requiredTokens.map(token => [token, rootStyle.getPropertyValue(token).trim()]));
  const missingTokens = requiredTokens.filter(token => !tokens[token]);
  const body = getComputedStyle(document.body);
  const bodyType = { family: body.fontFamily, size: parseFloat(body.fontSize), leading: parseFloat(body.lineHeight) };
  const restoreErrors: Array<{ token: string; before: unknown; restored: unknown }> = [];
  let tokenProbes = 0;
  const settle = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  async function withToken<T>(token: string, value: string, measure: () => T) {
    tokenProbes += 1;
    const previous = root.style.getPropertyValue(token), priority = root.style.getPropertyPriority(token);
    const before = measure();
    // Keep the existing inline declaration's importance while probing.
    // Changing both the value and priority makes the intervention ambiguous
    // and can leave WebKit using the previous important custom property.
    root.style.setProperty(token, value, priority);
    let after: T;
    // In a no-script document these reads synchronously flush style/layout.
    // Waiting for paint adds no cascade evidence and can stall indefinitely
    // when an offscreen hosted page's animation frames are throttled.
    // Hydrated representatives retain their two-frame settlement separately.
    try { if (!staticDocument) await settle(); after = measure(); }
    finally {
      if (previous) root.style.setProperty(token, previous, priority); else root.style.removeProperty(token);
      if (!staticDocument) await settle();
    }
    const restored = measure();
    if (JSON.stringify(before) !== JSON.stringify(restored)) restoreErrors.push({ token, before, restored });
    return { before, after, restored };
  }
  const fontProbe = await withToken('--font-interface', 'monospace', () => getComputedStyle(document.body).fontFamily);
  const fontConsumer = fontProbe.after === 'monospace' && fontProbe.before !== fontProbe.after;
  const leadingProbe = await withToken('--type-leading-body', '3.125', () => {
    const next = getComputedStyle(document.body);
    return parseFloat(next.lineHeight) / parseFloat(next.fontSize);
  });
  const leadingConsumer = Math.abs(leadingProbe.after - 3.125) < 0.01 && leadingProbe.before !== leadingProbe.after;

  const rules: CSSStyleRule[] = [];
  function visit(list: CSSRuleList) {
    for (const rule of Array.from(list)) {
      if (rule instanceof CSSMediaRule && !matchMedia(rule.conditionText).matches) continue;
      if (rule instanceof CSSSupportsRule && !CSS.supports(rule.conditionText)) continue;
      if (rule instanceof CSSStyleRule) rules.push(rule);
      if (rule instanceof CSSImportRule && rule.styleSheet) visit(rule.styleSheet.cssRules);
      else if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules);
    }
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try { visit(sheet.cssRules); } catch { /* An external sheet cannot establish the local contract. */ }
  }
  const spacingProperties = /^(?:margin|padding)(?:-|$)|^(?:row-|column-)?gap$/;
  // CSSOM enumerates longhands even when the author set a shorthand. For
  // unresolved var() shorthand values, its enumerated longhands serialize
  // to the empty string. Recover the actual authored shorthand explicitly.
  const shorthandParts: Record<string, string[]> = {
    margin: ['margin-top','margin-right','margin-bottom','margin-left'],
    padding: ['padding-top','padding-right','padding-bottom','padding-left'],
    'margin-inline': ['margin-inline-start','margin-inline-end'],
    'margin-block': ['margin-block-start','margin-block-end'],
    'padding-inline': ['padding-inline-start','padding-inline-end'],
    'padding-block': ['padding-block-start','padding-block-end'],
    gap: ['row-gap','column-gap'],
  };
  function spacingDeclarations(style: CSSStyleDeclaration) {
    const declarations: Array<{property: string; value: string}> = [];
    const represented = new Set<string>();
    for (const [property, parts] of Object.entries(shorthandParts)) {
      const value = style.getPropertyValue(property);
      if (!value) continue;
      declarations.push({property, value});
      for (const part of parts) represented.add(part);
    }
    for (const property of Array.from(style)) {
      if (!spacingProperties.test(property) || represented.has(property) || property in shorthandParts) continue;
      const value = style.getPropertyValue(property);
      if (value) declarations.push({property, value});
    }
    return declarations;
  }
  function measureSpacing(element: HTMLElement, property: string) {
    const computed = getComputedStyle(element);
    return (shorthandParts[property] ?? [property]).map(part => computed.getPropertyValue(part)).join(' | ');
  }
  // Positive geometry is not sufficient evidence of visibility: closed
  // details descendants may retain layout rects even though they cannot be read.
  function isRendered(element: HTMLElement) {
    if (element.closest('svg,math,.katex,[aria-hidden="true"]')) return false;
    for (let ancestor = element.parentElement?.closest('details:not([open])'); ancestor;
      ancestor = ancestor.parentElement?.closest('details:not([open])') ?? null) {
      const summary = Array.from(ancestor.children).find(child => child.tagName === 'SUMMARY');
      if (!summary?.contains(element)) return false;
    }
    if (typeof element.checkVisibility === 'function' && !element.checkVisibility({visibilityProperty: true})) return false;
    const style = getComputedStyle(element), rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }
  const spacingRules = rules.flatMap(rule => spacingDeclarations(rule.style)
    .map(declaration => ({ selector: rule.selectorText, ...declaration }))
    .filter(({ value }) => /var\(--(?:space|rhythm)-/.test(value))).reverse();
  const main = document.querySelector('main, .site-main, [role="main"]');
  const roleSelectors = {
    heading: 'h1,h2,h3,h4,h5,h6',
    prose: 'p,figcaption,dd',
    list: 'ul,ol',
    panel: '.card,.panel,.callout,.notice,details,[class*="__card"],[class*="-panel"]',
    control: 'button,input,select,textarea,[role="tab"]',
    utility: '[class*="tw:"]',
  };
  type Witness = { role: string; element: string; selector: string; property: string; token: string; before: string; after: string };
  const spacingConsumers: Witness[] = [];
  const roleCoverage: Array<{ role: string; visibleCandidates: number; spacedCandidates: number; consumer: boolean }> = [];
  const measuredProperties = ['margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','row-gap','column-gap'];
  for (const [role, selector] of Object.entries(roleSelectors)) {
    // A correct header cannot hide an orphan article. Each available reading,
    // list, card, control and utility role supplies its own real token response.
    const elements = Array.from(main?.querySelectorAll<HTMLElement>(selector) ?? []).filter(isRendered);
    // A visually clipped, keyboard-focusable native checkbox/radio can expose
    // its actual painted control via an associated label (e.g. chart zoom).
    // Measure that visible surface, not the hidden input's UA margin. Keep
    // native controls without a visible in-main label in the ordinary probe.
    const candidates = [...new Set(elements.flatMap(element => {
      if (role !== 'control' || !(element instanceof HTMLInputElement) ||
          !['checkbox','radio'].includes(element.type)) return [element];
      const style = getComputedStyle(element);
      if (style.opacity !== '0' || style.clipPath === 'none' ||
          !['absolute','fixed'].includes(style.position)) return [element];
      const labels = Array.from(element.labels ?? []).filter(label =>
        main?.contains(label) && isRendered(label) &&
        getComputedStyle(label).opacity !== '0' &&
        (typeof label.checkVisibility !== 'function' ||
          label.checkVisibility({opacityProperty: true, visibilityProperty: true})));
      return labels.length ? labels : [element];
    }))];
    // Sample spaced candidates, not the first eight elements regardless of
    // spacing. A role with no visible nonzero spacing needs no witness.
    const spaced = candidates.filter(element => {
      const style = getComputedStyle(element);
      return measuredProperties.some(property => parseFloat(style.getPropertyValue(property)) > 0);
    });
    let witness: Witness | null = null;
    for (const element of spaced.slice(0, 8)) {
      // Multiple cascade layers can name the same token/property pair. Once
      // its computed response is measured and restored, repeating that exact
      // intervention cannot add evidence about this unchanged element.
      const attemptedPairs = new Set<string>();
      const inline = spacingDeclarations(element.style).map(declaration => ({selector: '<inline>', ...declaration}));
      for (const rule of [...inline, ...spacingRules]) {
        try { if (rule.selector !== '<inline>' && !element.matches(rule.selector)) continue; } catch { continue; }
        for (const match of rule.value.matchAll(/var\((--(?:space|rhythm)-[\w-]+)\)/g)) {
          const token = match[1];
          if (!token) continue;
          const pair = rule.property + '\0' + token;
          if (attemptedPairs.has(pair)) continue;
          attemptedPairs.add(pair);
          const { before, after } = await withToken(token, token === '--space-em-factor' ? '3' : '113px', () => measureSpacing(element, rule.property));
          if (before !== after) {
            witness = { role, element: element.tagName.toLowerCase(), selector: rule.selector, property: rule.property, token, before, after };
            break;
          }
        }
        if (witness) break;
      }
      if (witness) break;
    }
    if (witness) spacingConsumers.push(witness);
    roleCoverage.push({ role, visibleCandidates: candidates.length, spacedCandidates: spaced.length, consumer: Boolean(witness) });
  }
  const missingRoleConsumers = roleCoverage.filter(role => role.spacedCandidates > 0 && !role.consumer).map(role => role.role);
  const visibleProse = Array.from(main?.querySelectorAll<HTMLElement>('p') ?? []).filter(isRendered);
  // A percentage/none cap may be the actual mobile owner. Do not pretend a
  // fixed reading measure governs it. Perturb a wider, fixed-measure paragraph
  // below its available width and require actual visible geometry to change.
  const readingCandidates = visibleProse.filter(element => {
    const maximum = getComputedStyle(element).maxWidth;
    return maximum !== 'none' && !maximum.includes('%') && element.getBoundingClientRect().width > 80;
  });
  let readingConsumer: null | { element: string; before: { maximum: string; width: number }; after: { maximum: string; width: number } } = null;
  for (const element of readingCandidates) {
    const { before, after } = await withToken('--reading-width', '8ch', () => ({ maximum: getComputedStyle(element).maxWidth, width: element.getBoundingClientRect().width }));
    if (before.maximum !== after.maximum && after.width < before.width - 1) { readingConsumer = { element: element.tagName.toLowerCase() + '.' + Array.from(element.classList).join('.'), before, after }; break; }
  }
  const heading = main?.querySelector('h1') ?? null;
  const headingStyle = heading ? getComputedStyle(heading) : null;
  const inlineSpacing: InlineSpacing[] = [];
  for (const element of Array.from(document.querySelectorAll<HTMLElement>('[style]'))) {
    if (element.closest('svg,math,.katex')) continue;
    const declarations = spacingDeclarations(element.style);
    for (const property of ['max-width','max-inline-size']) {
      const value = element.style.getPropertyValue(property);
      if (value) declarations.push({property,value});
    }
    for (const declaration of declarations) {
      inlineSpacing.push({ element: element.tagName, selector: element.tagName.toLowerCase() + '.' + Array.from(element.classList).join('.'), ...declaration });
    }
  }
  return {
    missingTokens, tokens, body: bodyType, fontConsumer, leadingConsumer, restoreErrors, tokenProbes,
    probeElapsedMs: performance.now() - probeStarted, settlement: staticDocument ? 'computed-style' : 'two-frames',
    spacingConsumer: spacingConsumers[0] ?? null, spacingConsumers, roleCoverage, missingRoleConsumers, inlineSpacing,
    readingCandidates: readingCandidates.length, readingLayoutCaps: visibleProse.length - readingCandidates.length, readingConsumer,
    readingWidth: getComputedStyle(root).getPropertyValue('--reading-width').trim(),
    heading: heading && headingStyle ? { family: headingStyle.fontFamily, size: parseFloat(headingStyle.fontSize), leading: parseFloat(headingStyle.lineHeight) } : null,
    overflow: root.scrollWidth - root.clientWidth,
    rootOverflowX: getComputedStyle(root).overflowX,
  };
}

