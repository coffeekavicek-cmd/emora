import { test, expect } from '@playwright/test';

test.describe('Memory Reel Reborn',()=>{
  test('mobile recipient threads reel → scrubs archive → film burn → finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=birthday-memory&name=Malika');
    await expect(page.locator('.memory-reel-reborn')).toBeVisible();
    await expect(page.locator('.memory-reel-reborn')).toHaveClass(/phase-thread/,{timeout:4000});
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);

    const thread=page.getByRole('button',{name:'Film lentasini proyektorga torting'}),tb=await thread.boundingBox();expect(tb).not.toBeNull();
    if(tb){const x=tb.x+20,y=tb.y+tb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+300,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.memory-reel-reborn')).toHaveClass(/phase-play|phase-archive/,{timeout:3500});
    await expect(page.locator('.memory-reel-reborn')).toHaveClass(/phase-archive/,{timeout:4500});

    const scrub=page.getByRole('button',{name:'Film xotiralarini o‘ngga suring'}),sb=await scrub.boundingBox();expect(sb).not.toBeNull();
    if(sb){const x=sb.x+20,y=sb.y+sb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+360,y,{steps:20});await page.mouse.up()}
    await expect(page.locator('.memory-reel-reborn')).toHaveClass(/phase-jam|phase-finale/,{timeout:3500});
    await expect(page.locator('.memory-reel-reborn')).toHaveClass(/phase-finale/,{timeout:6500});
    await expect(page.locator('.mrr-finale h2')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('memory-reborn-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Reborn editor previews Memory Reel',async({page})=>{
    await page.goto('/?mode=editor&template=birthday-memory');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.re-screen .memory-reel-reborn')).toBeVisible({timeout:10000});
  });
});
