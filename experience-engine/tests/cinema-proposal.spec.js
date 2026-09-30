import { test, expect } from '@playwright/test';

test.describe('Cinema Proposal Reborn private screening',()=>{
  test('mobile recipient tears ticket → scrubs film → reaches proposal question',async({page},testInfo)=>{
    test.setTimeout(45000);
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=proposal-cinema&name=Malika');
    await expect(page.locator('.cinema-proposal-reborn')).toBeVisible();
    await expect(page).toHaveTitle(/Cinema Proposal/);
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-cinema-reborn-ticket.png'),fullPage:true});

    const ticket=page.getByRole('button',{name:'Biletni yirtib kinoni boshlang'});const tb=await ticket.boundingBox();expect(tb).not.toBeNull();
    if(tb){const x=tb.x+20,y=tb.y+tb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+245,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.cinema-proposal-reborn')).toHaveClass(/phase-projector|phase-reel/,{timeout:3500});
    await expect(page.locator('.cinema-proposal-reborn')).toHaveClass(/phase-reel/,{timeout:4500});

    const scrub=page.getByRole('button',{name:'Film xotiralarini o‘ngga suring'});const sb=await scrub.boundingBox();expect(sb).not.toBeNull();
    if(sb){const x=sb.x+20,y=sb.y+sb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+360,y,{steps:20});await page.mouse.up()}
    await expect(page.locator('.cinema-proposal-reborn')).toHaveClass(/phase-jam/,{timeout:3500});
    await page.screenshot({path:testInfo.outputPath('02-cinema-reborn-jam.png'),fullPage:true});
    await expect(page.locator('.cinema-proposal-reborn')).toHaveClass(/phase-question/,{timeout:5000});
    await expect(page.locator('.cpr-question h2')).toBeVisible();
    await expect(page.locator('.cpr-question em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-cinema-reborn-question.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Reborn editor previews Cinema Proposal Reborn',async({page})=>{
    await page.goto('/?mode=editor&template=proposal-cinema');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.locator('.re-screen .cinema-proposal-reborn')).toBeVisible({timeout:10000});
    await expect(page.locator('.re-screen .cinema-proposal')).toHaveCount(0);
  });
});
