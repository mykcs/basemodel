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
export async function readRenderedDesign(requiredTokens: string[]) {
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
    root.style.setProperty(token, value);
    let after: T;
    try { await settle(); after = measure(); }
    finally {
      if (previous) root.style.setProperty(token, previous, priority); else root.style.removeProperty(token);
      await settle();
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
  const spacingRules = rules.flatMap(rule => Array.from(rule.style)
    .filter(property => spacingProperties.test(property))
    .map(property => ({ selector: rule.selectorText, property, value: rule.style.getPropertyValue(property) }))
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
    const candidates = Array.from(main?.querySelectorAll<HTMLElement>(selector) ?? []).filter(element => {
      if (element.closest('svg,math,.katex,[aria-hidden="true"]')) return false;
      const style = getComputedStyle(element), rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }).slice(0, 8);
    const spaced = candidates.filter(element => measuredProperties.some(property => parseFloat(getComputedStyle(element).getPropertyValue(property)) > 0));
    let witness: Witness | null = null;
    for (const element of spaced) {
      // Multiple cascade layers can name the same token/property pair. Once
      // its computed response is measured and restored, repeating that exact
      // intervention cannot add evidence about this unchanged element.
      const attemptedPairs = new Set<string>();
      const inline = Array.from(element.style).filter(property => spacingProperties.test(property))
        .map(property => ({ selector: '<inline>', property, value: element.style.getPropertyValue(property) }));
      for (const rule of [...inline, ...spacingRules]) {
        try { if (rule.selector !== '<inline>' && !element.matches(rule.selector)) continue; } catch { continue; }
        for (const match of rule.value.matchAll(/var\((--(?:space|rhythm)-[\w-]+)\)/g)) {
          const token = match[1];
          if (!token) continue;
          const pair = rule.property + '\0' + token;
          if (attemptedPairs.has(pair)) continue;
          attemptedPairs.add(pair);
          const { before, after } = await withToken(token, token === '--space-em-factor' ? '3' : '113px', () => getComputedStyle(element).getPropertyValue(rule.property));
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
  const visibleProse = Array.from(main?.querySelectorAll<HTMLElement>('p') ?? []).filter(element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && !element.closest('svg,math,.katex,[aria-hidden="true"]');
  });
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
    for (const property of Array.from(element.style)) {
      if (!spacingProperties.test(property) && !/^(?:max-width|max-inline-size)$/.test(property)) continue;
      inlineSpacing.push({ element: element.tagName, selector: element.tagName.toLowerCase() + '.' + Array.from(element.classList).join('.'), property, value: element.style.getPropertyValue(property) });
    }
  }
  return {
    missingTokens, tokens, body: bodyType, fontConsumer, leadingConsumer, restoreErrors, tokenProbes,
    spacingConsumer: spacingConsumers[0] ?? null, spacingConsumers, roleCoverage, missingRoleConsumers, inlineSpacing,
    readingCandidates: readingCandidates.length, readingLayoutCaps: visibleProse.length - readingCandidates.length, readingConsumer,
    readingWidth: getComputedStyle(root).getPropertyValue('--reading-width').trim(),
    heading: heading && headingStyle ? { family: headingStyle.fontFamily, size: parseFloat(headingStyle.fontSize), leading: parseFloat(headingStyle.lineHeight) } : null,
    overflow: root.scrollWidth - root.clientWidth,
    rootOverflowX: getComputedStyle(root).overflowX,
  };
}

