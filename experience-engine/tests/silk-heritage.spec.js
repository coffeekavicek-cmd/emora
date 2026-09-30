import { test, expect } from '@playwright/test';

async function drag(page,locator,px){const b=await locator.boundingBox();expect(b).not.toBeNull();if(!b)return;const x=b.x+18,y=b.y+b.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+px,y,{steps:22});await page.mouse.up()}

test.describe('Silk Heritage flagship ritual',()=>{
  test('pulls silk → watches gold stitch → continuously weaves 3 memories → invitation',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=wedding-silk&name=Aziza&date=2026-10-10T18%3A00&venue=Silk%20Garden&address=Tashkent');await expect(page.locator('.silk-heritage-reborn')).toBeVisible();
    await drag(page,page.getByRole('button',{name:'Ipak ipini o‘ngga torting'}),320);await expect(page.locator('.silk-heritage-reborn')).toHaveClass(/phase-stitch/,{timeout:3500});await expect(page.locator('.silk-heritage-reborn')).toHaveClass(/phase-gallery/,{timeout:5200});
    const weave=page.getByRole('button',{name:'Oltin ipni davom ettirib uch xotirani tiking'});await drag(page,weave,620);await expect(page.locator('.shr2-memory-loom figure.open')).toHaveCount(3);
    await expect(page.locator('.silk-heritage-reborn')).toHaveClass(/phase-invitation/,{timeout:3500});await expect(page.locator('.shr-invitation h2')).toContainText('Aziza');
    await page.screenshot({path:testInfo.outputPath('silk-flagship-invitation.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('editor previews flagship Silk Heritage',async({page})=>{await page.goto('/?mode=editor&template=wedding-silk');await expect(page.locator('.reborn-editor')).toBeVisible();await page.getByRole('button',{name:'Preview',exact:true}).click();await expect(page.locator('.re-screen .silk-heritage-reborn')).toBeVisible({timeout:10000});await expect(page.locator('.re-screen .shr2')).toBeVisible();});
});
