import { test, expect } from '@playwright/test';

test.describe('Pearl Linen · Reborn Archive',()=>{
  test('editor preview uses the new Archive runtime',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?mode=editor&template=love-pearl');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await page.locator('.re-panel input').first().fill('Malika');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.re-screen .pearl-reborn')).toBeVisible({timeout:10000});
    await expect(page.locator('.re-screen .pearl-motion')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('mobile recipient completes thread → folio → archive → particle finale',async({page},testInfo)=>{
    test.setTimeout(60000);
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=love-pearl&name=Malika');
    await expect(page.locator('.pearl-reborn')).toBeVisible();
    await expect(page).toHaveTitle(/Pearl Linen/);
    await expect(page.locator('.pr-world-canvas')).toHaveCount(1);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);

    await expect(page.locator('.pearl-reborn')).toHaveClass(/phase-thread/,{timeout:5000});
    await page.screenshot({path:testInfo.outputPath('01-thread.png'),fullPage:true});

    const thread=page.getByRole('button',{name:'Marvaridni ip bo‘ylab o‘ngga torting'});
    const tb=await thread.boundingBox();expect(tb).not.toBeNull();
    if(tb){
      const x=tb.x+20,y=tb.y+tb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+520,y,{steps:22});await page.mouse.up();
    }

    await expect(page.locator('.pearl-reborn')).toHaveClass(/phase-folio/,{timeout:5000});
    await page.screenshot({path:testInfo.outputPath('02-folio.png'),fullPage:true});

    const seal=page.getByRole('button',{name:'Muhrni bosib ushlab oching'});
    const sb=await seal.boundingBox();expect(sb).not.toBeNull();
    if(sb){
      const x=sb.x+sb.width/2,y=sb.y+sb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.waitForTimeout(920);await page.mouse.up();
    }

    await expect(page.locator('.pearl-reborn')).toHaveClass(/phase-letter/,{timeout:4000});
    await expect(page.locator('.pr-letter-sheet h2')).toHaveClass(/show/,{timeout:3500});
    await page.screenshot({path:testInfo.outputPath('03-letter.png'),fullPage:true});

    await expect(page.locator('.pearl-reborn')).toHaveClass(/phase-archive/,{timeout:8000});
    const archive=page.getByRole('button',{name:'Xotiralarni chapdan o‘ngga siljiting'});
    const ab=await archive.boundingBox();expect(ab).not.toBeNull();
    if(ab){
      const x=ab.x+20,y=ab.y+ab.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+560,y,{steps:24});await page.mouse.up();
    }

    await expect(page.locator('.pearl-reborn')).toHaveClass(/phase-false-ending|phase-particles/,{timeout:4500});
    await page.screenshot({path:testInfo.outputPath('04-false-ending.png'),fullPage:true});
    await expect(page.locator('.pearl-reborn')).toHaveClass(/phase-particles/,{timeout:4500});
    await expect(page.locator('.pr-signature-canvas')).toBeVisible();
    await expect(page.locator('.pr-final-copy')).toHaveClass(/show/,{timeout:7000});
    await expect(page.locator('.pr-final-copy h2')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('05-finale.png'),fullPage:true});

    expect(errors).toEqual([]);
  });
});
