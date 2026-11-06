import { expect, type Locator, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

/** Open the object's real reading state, including native exclusive accordions. */
export async function revealEvidenceReadingState(target: Locator) {
  const parameterCase=await target.evaluate(el=>el.closest('[data-parameter-case]')?.getAttribute('data-parameter-case'));
  if(parameterCase)
    await target.page().locator('[data-parameter-controls] input[value="'+parameterCase+'"]').check();
  await target.evaluate(el=>{
    const ancestors:HTMLDetailsElement[]=[];
    for(let parent=el.parentElement;parent;parent=parent.parentElement)
      if(parent instanceof HTMLDetailsElement)ancestors.unshift(parent);
    for(const detail of ancestors)detail.open=true;
  });
  const shoppingFrame=await target.evaluate(el=>el.closest('[data-shopping-frame]')?.getAttribute('data-shopping-frame'));
  if(shoppingFrame!==null&&shoppingFrame!==undefined){
    const example=target.locator('xpath=ancestor::*[@data-task-example][1]');
    await example.locator('[data-example-reset]').click();
    for(let step=0;step<Number(shoppingFrame);step++)await example.locator('[data-example-next]').click();
    await expect(target).toBeVisible();
  }
  return shoppingFrame!==null&&shoppingFrame!==undefined?'shopping example step '+shoppingFrame:parameterCase?'parameter comparison '+parameterCase:'ancestor evidence details opened';
}

/** A scoped reading-state token, not a cached image, geometry or font result. */
export interface FigureEvidencePreparation {
  readonly readingState: string;
  dispose(): Promise<void>;
}

const preparations = new WeakMap<FigureEvidencePreparation, { page: Page; snapshot: string; reusable: boolean; preparationMs: number; profileReported: boolean }>();
let documentSequence = 0;

async function readingStateSnapshot(target: Locator) {
  return target.evaluate((el, proposedDocumentId) => {
    // Weak element identities distinguish replacement nodes without serializing
    // document text or walking every node in a dense scientific table.
    const scope = window as typeof window & {
      __pwFigureReadingIdentity?: { document: Document; id: number; next: number; elements: WeakMap<Element, number> };
    };
    if (!scope.__pwFigureReadingIdentity || scope.__pwFigureReadingIdentity.document !== document) {
      scope.__pwFigureReadingIdentity = { document, id: proposedDocumentId, next: 0, elements: new WeakMap() };
    }
    const identity = scope.__pwFigureReadingIdentity;
    const id = (node: Element) => {
      let value = identity.elements.get(node);
      if (value === undefined) { value = ++identity.next; identity.elements.set(node, value); }
      return value;
    };
    const details = [];
    for (let node: Element | null = el; node; node = node.parentElement) {
      if (node instanceof HTMLDetailsElement) details.push([id(node), node.open, node.name]);
    }
    const shopping = el.closest('[data-shopping-frame]');
    return {
      // Shopping reset/step controls have application-owned side effects. Keep
      // their original preparation on every capture rather than caching them.
      reusable: shopping === null,
      value: JSON.stringify({
        document: identity.id, target: id(el),
        viewport: [innerWidth, innerHeight, devicePixelRatio], print: matchMedia('print').matches,
        theme: [localStorage.getItem('atlas-theme'), document.documentElement.getAttribute('data-theme'), document.documentElement.className],
        details,
        parameterCase: el.closest('[data-parameter-case]')?.getAttribute('data-parameter-case'),
        radios: [...document.querySelectorAll<HTMLInputElement>('[data-parameter-controls] input')]
          .map(input => [id(input), input.value, input.checked, input.disabled]),
      }),
    };
  }, ++documentSequence);
}

/** Reveal once for a caller's metadata + capture batch. Every PNG still gets
 * fresh image decoding, scroll/clip geometry, font readiness and native capture. */
export async function prepareFigureEvidence(target: Locator): Promise<FigureEvidencePreparation> {
  const started = performance.now();
  const readingState = await revealEvidenceReadingState(target);
  const snapshot = await readingStateSnapshot(target);
  const token: FigureEvidencePreparation = Object.freeze({
    readingState,
    async dispose() { preparations.delete(token); },
  });
  preparations.set(token, { page: target.page(), snapshot: snapshot.value, reusable: snapshot.reusable, preparationMs: performance.now() - started, profileReported: false });
  return token;
}

export async function isFigureEvidencePreparationCurrent(target: Locator, token: FigureEvidencePreparation) {
  const prepared = preparations.get(token);
  if (!prepared || !prepared.reusable || prepared.page !== target.page()) return false;
  try {
    const current = await readingStateSnapshot(target);
    return current.reusable && current.value === prepared.snapshot;
  } catch {
    // Navigation, a detached locator or a disposed page can never reuse state.
    return false;
  }
}

export function recordFigureEvidenceProfile(path: string, phases: Record<string, number | boolean | string>) {
  if (process.env.CI_CAPTURE_PROFILE !== '1') return;
  const dir = process.env.CI_CAPTURE_PROFILE_DIR ?? join(process.env.RUNNER_TEMP ?? tmpdir(), 'basemodel-capture-profile', String(process.pid));
  mkdirSync(dir, { recursive: true });
  const capture = relative(process.cwd(), path);
  const key = createHash('sha256').update(capture).digest('hex');
  writeFileSync(join(dir, key + '.json'), JSON.stringify({ capture, ...phases }) + '\n');
}

/** Decode the current visible reading state before native document clipping.
 * No DOM is hidden, restyled or raster-edited for the capture. */
export async function captureFigureEvidence(figure: Locator, path: string, prepared?: FigureEvidencePreparation) {
  const started = performance.now();
  const page = figure.page();
  const reusedReadingState = prepared ? await isFigureEvidencePreparationCurrent(figure, prepared) : false;
  if (!reusedReadingState) await revealEvidenceReadingState(figure);
  const revealed = performance.now();
  const scrollPositions=await figure.evaluateHandle(el=>{
    const nodes=new Set<Element>([el,...el.querySelectorAll('*')]);
    for(let parent=el.parentElement;parent;parent=parent.parentElement)nodes.add(parent);
    return [...nodes].filter(node=>node!==document.documentElement&&node!==document.body&&(node.scrollWidth>node.clientWidth||node.scrollHeight>node.clientHeight))
      .map(node=>({node,top:node.scrollTop,left:node.scrollLeft}));
  });
  await figure.evaluate(async el=>{
    el.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
    // Dense tables must not pay thousands of locator round trips. Every
    // visible image still decodes; unloaded lazy images receive real scrolling.
    const images=[...el.querySelectorAll('img')].filter(image=>{
      const style=getComputedStyle(image),rect=image.getBoundingClientRect();
      return rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&style.visibility!=='collapse';
    });
    for(const image of images) {
      if(!image.complete||!image.naturalWidth) {
        await new Promise<void>((resolve,reject)=>{
          const cleanup=()=>{
            image.removeEventListener('load',loaded);
            image.removeEventListener('error',failed);
          };
          const loaded=()=>{cleanup();resolve();};
          const failed=()=>{cleanup();reject(new Error('Visible evidence image failed to load: '+image.currentSrc));};
          image.addEventListener('load',loaded,{once:true});
          image.addEventListener('error',failed,{once:true});
          image.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
          requestAnimationFrame(()=>{
            if(image.complete){if(image.naturalWidth)loaded();else failed();}
          });
        });
      }
      await image.decode();
      if(!image.naturalWidth)throw new Error('Visible evidence image is empty');
    }
  });
  await scrollPositions.evaluate(rows=>rows.forEach(({node,top,left})=>node.scrollTo({top,left,behavior:'instant'})));
  await scrollPositions.dispose();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    window.scrollTo({top:0,left:0,behavior:'instant'});
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  const ready = performance.now();
  const clip = await figure.evaluate(el => {
    const rect = el.getBoundingClientRect();
    let left=rect.left,right=rect.right,top=rect.top,bottom=rect.bottom;
    for(let parent=el.parentElement;parent&&parent!==document.body&&parent!==document.documentElement;parent=parent.parentElement){
      const css=getComputedStyle(parent),bounds=parent.getBoundingClientRect();
      if(css.overflowX!=='visible'){
        left=Math.max(left,bounds.left+parent.clientLeft);
        right=Math.min(right,bounds.left+parent.clientLeft+parent.clientWidth);
      }
      if(css.overflowY!=='visible'){
        top=Math.max(top,bounds.top+parent.clientTop);
        bottom=Math.min(bottom,bounds.top+parent.clientTop+parent.clientHeight);
      }
    }
    if(right<=left||bottom<=top)throw new Error('Evidence has no visible reading surface after native clipping');
    return { x:left+scrollX,y:top+scrollY,width:right-left,height:bottom-top };
  });
  const measured = performance.now();
  await page.screenshot({path,clip,fullPage:true,animations:'disabled'});
  const captured = performance.now();
  const preparation = prepared ? preparations.get(prepared) : undefined;
  const outerPreparationMs = preparation && !preparation.profileReported ? preparation.preparationMs : 0;
  if (preparation) preparation.profileReported = true;
  recordFigureEvidenceProfile(path, {
    kind: 'capture', outerPreparationMs,
    readingStateMs: revealed - started, objectReadinessMs: ready - revealed,
    clipMs: measured - ready, nativeScreenshotMs: captured - measured,
    totalMs: captured - started, reusedReadingState,
  });
  return clip;
}

/** Settle evidence-bearing client:visible islands before freezing nth locators.
 * Scrolling activates the real hydration path; never suppress application JS. */
export async function settleFigureHydration(page: Page) {
  const islands=page.locator('astro-island[client="visible"]').filter({
    has:page.locator('figure, svg[role="img"], table'),
  });
  for (const island of await islands.all()) {
    await island.locator('figure, svg[role="img"], table').first().scrollIntoViewIfNeeded();
    await expect(island).not.toHaveAttribute('ssr','');
  }
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
    window.scrollTo({top:0,left:0,behavior:'instant'});
  });
}
