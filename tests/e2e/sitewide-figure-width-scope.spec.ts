[object Object]

for (const width of [390,768,1440]) for (const theme of ['light','dark'] as const) {
  test('scientific timing and composition tables keep readable labels with local scrolling: '+width+' '+theme,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('atlas-theme',value),theme);
    await page.goto('/research/seed-openevo/study/parameter-memory-results/',{waitUntil:'load'});
    const timing=page.locator('.advisor-timing-table');
    await timing.evaluate(node=>{
      for(let parent=node.parentElement;parent;parent=parent.parentElement)
        if(parent instanceof HTMLDetailsElement)parent.open=true;
    });
    const labelLines=()=>timing.locator('tbody th').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      return range.getClientRects().length;
    }));
    const acceptLabels=(lines:number[])=>lines.forEach(count=>expect(count).toBe(1));
    acceptLabels(await labelLines());
    for(const value of ['31.09','2.02','15.36','74.78','56.25','1.33'])await expect(timing).toContainText(value);
    if(width===390){
      await timing.locator('tbody th').evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.whiteSpace='normal'));
      const old=await labelLines();
      expect(old.some(count=>count>1)).toBe(true);
      expect(()=>acceptLabels(old)).toThrow();
      await timing.locator('tbody th').evaluateAll(nodes=>nodes.forEach(node=>(node as HTMLElement).style.removeProperty('white-space')));
      acceptLabels(await labelLines());
    }
    const rowBounds=()=>page.locator('.advisor-result-matrix tbody th[scope="row"]').evaluateAll(nodes=>nodes.map(node=>{
      const range=document.createRange();range.selectNodeContents(node);
      const cell=node.getBoundingClientRect();
      return {text:node.textContent,lines:[...range.getClientRects()].map(rect=>({left:rect.left,right:rect.right})),left:cell.left,right:cell.right};
    }));
    const acceptRows=(rows:Awaited<ReturnType<typeof rowBounds>>)=>rows.forEach(row=>{
      expect(row.lines.length).toBeGreaterThan(0);
      for(const line of row.lines){expect(line.left).toBeGreaterThanOrEqual(row.left-1);expect(line.right).toBeLessThanOrEqual(row.right+1);}
    });
    acceptRows(await rowBounds());
    if(width===390){
      const oldLabel=page.locator('[data-advisor-matrix="q01"] tbody tr').nth(1).locator('th');
      await oldLabel.evaluate(node=>(node as HTMLElement).style.whiteSpace='nowrap');
      const oldRows=await rowBounds();
      expect(()=>acceptRows(oldRows)).toThrow();
      await oldLabel.evaluate(node=>(node as HTMLElement).style.removeProperty('white-space'));
      acceptRows(await rowBounds());
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    await page.goto('/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/',{waitUntil:'load'});
    const composition=page.locator('.ba-accel__table').filter({hasText:'能否直接 composition'});
    const wordLines=()=>composition.locator('thead th').nth(1).evaluate(node=>{
      const text=node.firstChild;
      if(!text||text.nodeType!==Node.TEXT_NODE)throw Error('Missing composition label text');
      const start=(text.textContent??'').indexOf('composition');
      if(start<0)throw Error('Missing scientific comparison label');
      const range=document.createRange();range.setStart(text,start);range.setEnd(text,start+'composition'.length);
      return range.getClientRects().length;
    });
    expect(await wordLines()).toBe(1);
    const holder=composition.locator('..');
    await expect(holder).toHaveCSS('overflow-x','auto');
    if(width===390){
      const geometry=await holder.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth}));
      expect(geometry.scroll).toBeGreaterThan(geometry.client);
      await composition.evaluate(node=>{
        (node as HTMLElement).style.minWidth='0';
        (node as HTMLElement).style.maxWidth='min(100%,46rem)';
        (node.querySelector('thead th:nth-child(2)') as HTMLElement).style.whiteSpace='normal';
      });
      const old=await wordLines();
      expect(old).toBeGreaterThan(1);
      expect(()=>expect(old).toBe(1)).toThrow();
      await composition.evaluate(node=>{
        (node as HTMLElement).style.removeProperty('min-width');
        (node as HTMLElement).style.removeProperty('max-width');
        (node.querySelector('thead th:nth-child(2)') as HTMLElement).style.removeProperty('white-space');
      });
      expect(await wordLines()).toBe(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
}
