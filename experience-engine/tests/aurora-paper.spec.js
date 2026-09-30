import { test, expect } from '@playwright/test';

async function dragRight(page,locator,px=270){const b=await locator.boundingBox();expect(b).not.toBeNull();if(!b)return;const x=b.x+18,y=b.y+b.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+px,y,{steps:20});await page.mouse.up()}

test.describe('Aurora Paper Reborn V2 living-paper ritual',()=>{
  test('mobile recipient releases ribbon → peels 3 living sheets → tears light → aurora finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=birthday-aurora&name=Malika');await expect(page.locator('.aurora-paper-reborn')).toBeVisible();
    await dragRight(page,page.getByRole('button',{name:'Sovg‘a lentasini o‘ngga torting'}),260);
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-layers/,{timeout:3500});
    for(let i=1;i<=3;i++){const sheet=page.getByRole('button',{name:`${i}-qog‘oz qatlamini chetga yirting`});await expect(sheet).toBeVisible();await dragRight(page,sheet,275)}
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-tear/,{timeout:4000});
    await dragRight(page,page.getByRole('button',{name:'Oxirgi qog‘oz qatlamini yirting'}),285);
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-silence|phase-finale/,{timeout:2500});
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-finale/,{timeout:3000});
    await expect(page.locator('.apr-finale h2')).toContainText('Malika');
    await expect(page.locator('.apr2-aurora-ribbons i')).toHaveCount(7);
    await page.screenshot({path:testInfo.outputPath('aurora-v2-finale.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('Reborn editor previews Aurora Paper V2',async({page})=>{await page.goto('/?mode=editor&template=birthday-aurora');await expect(page.locator('.reborn-editor')).toBeVisible();const preview=page.getByRole('button',{name:'Preview',exact:true});if(await preview.isVisible())await preview.click();await expect(page.locator('.re-screen .aurora-paper-reborn')).toBeVisible({timeout:10000});await expect(page.locator('.re-screen .apr2')).toBeVisible();});
});
